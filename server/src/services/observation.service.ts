import { getDatabase } from '../config/database.js';

const getDb = getDatabase;
import type {
  Observation,
  ObservationDetail,
  SnowLayer,
  TemperaturePoint,
  StabilityTestGroup,
  StabilityTest,
  ObservationPhoto,
} from '../types/index.js';

// 获取观测列表
export function getObservations(options: {
  page?: number;
  limit?: number;
  userId?: number;
}): { observations: Observation[]; total: number; page: number; totalPages: number } {
  const db = getDb();
  const page = options.page || 1;
  const limit = options.limit || 20;
  const offset = (page - 1) * limit;

  let whereClause = '';
  const params: any[] = [];

  if (options.userId) {
    whereClause = 'WHERE o.created_by = ?';
    params.push(options.userId);
  }

  const countResult = db.prepare(`
    SELECT COUNT(*) as total FROM observations o ${whereClause}
  `).get(...params) as { total: number };

  const observations = db.prepare(`
    SELECT
      o.id,
      o.record_id,
      o.location_description,
      o.observer,
      o.observation_date,
      o.elevation,
      o.slope_aspect,
      o.total_snow_depth,
      o.air_temperature,
      o.weather,
      o.created_by,
      o.created_at,
      o.updated_at,
      u.display_name as observer_name
    FROM observations o
    LEFT JOIN users u ON o.created_by = u.id
    ${whereClause}
    ORDER BY o.observation_date DESC, o.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset) as Observation[];

  return {
    observations,
    total: countResult.total,
    page,
    totalPages: Math.ceil(countResult.total / limit),
  };
}

// 获取单个观测详情
export function getObservationById(id: number): ObservationDetail | null {
  const db = getDb();

  const observation = db.prepare(`
    SELECT
      o.*,
      u.display_name as observer_name
    FROM observations o
    LEFT JOIN users u ON o.created_by = u.id
    WHERE o.id = ?
  `).get(id) as ObservationDetail | undefined;

  if (!observation) return null;

  // 获取雪层数据
  const snowLayers = db.prepare(`
    SELECT * FROM snow_layers WHERE observation_id = ? ORDER BY sort_order ASC
  `).all(id) as SnowLayer[];

  // 获取稳定性测试组
  const testGroups = db.prepare(`
    SELECT * FROM stability_test_groups WHERE observation_id = ? ORDER BY sort_order ASC
  `).all(id) as StabilityTestGroup[];

  // 获取每个组的测试
  for (const group of testGroups) {
    const tests = db.prepare(`
      SELECT * FROM stability_tests WHERE group_id = ? ORDER BY sort_order ASC
    `).all(group.id) as StabilityTest[];
    group.tests = tests;
  }

  // 获取照片
  const photos = db.prepare(`
    SELECT * FROM observation_photos WHERE observation_id = ? ORDER BY sort_order ASC
  `).all(id) as ObservationPhoto[];

  return {
    ...observation,
    snow_layers: snowLayers,
    stability_test_groups: testGroups,
    photos,
  };
}

// 创建观测记录
export function createObservation(
  data: Partial<ObservationDetail>,
  userId: number
): { id: number } {
  console.log('createObservation service called:', { data, userId });
  
  const db = getDb();
  console.log('DB connected');

  const result = db.prepare(`
    INSERT INTO observations (
      record_id, location_description, observer, observation_date,
      gps_coordinates, elevation, slope_aspect, slope_angle,
      total_snow_depth, air_temperature, weather, boot_penetration,
      wind, blowing_snow, conclusion, diagram_x_axis_side,
      diagram_y_axis_direction, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.record_id || null,
    data.location_description || null,
    data.observer || '测试用户',
    data.observation_date || new Date().toISOString().split('T')[0],
    data.gps_coordinates || null,
    data.elevation || null,
    data.slope_aspect || null,
    data.slope_angle || null,
    data.total_snow_depth || null,
    data.air_temperature || null,
    data.weather || null,
    data.boot_penetration || null,
    data.wind || null,
    data.blowing_snow || null,
    data.conclusion || null,
    data.diagram_x_axis_side || 'left',
    data.diagram_y_axis_direction || 'down',
    userId
  );

  console.log('Insert result:', { 
    changes: result.changes, 
    lastInsertRowid: result.lastInsertRowid 
  });

  const observationId = result.lastInsertRowid as number;
  console.log('Final observation ID:', observationId);

  // 插入雪层数据
  if (data.snow_layers && data.snow_layers.length > 0) {
    const insertLayer = db.prepare(`
      INSERT INTO snow_layers (
        observation_id, start_depth, end_depth, temperature, hardness,
        crystal_type, grain_size, wetness, notes, hardness_top,
        hardness_bottom, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    data.snow_layers.forEach((layer, index) => {
      insertLayer.run(
        observationId,
        layer.start_depth ?? null,
        layer.end_depth ?? null,
        layer.temperature || null,
        layer.hardness || null,
        layer.crystal_type || null,
        layer.grain_size || null,
        layer.wetness || null,
        layer.notes || null,
        layer.hardness_top ?? null,
        layer.hardness_bottom ?? null,
        index
      );
    });
  }

  // 插入稳定性测试组
  if (data.stability_test_groups && data.stability_test_groups.length > 0) {
    const insertGroup = db.prepare(`
      INSERT INTO stability_test_groups (
        observation_id, depth, weak_layer_type, weak_layer_grain_size,
        notes, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertTest = db.prepare(`
      INSERT INTO stability_tests (
        group_id, test_type, taps, result, quality, cut, length,
        propagation, score, notes, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    data.stability_test_groups.forEach((group, groupIndex) => {
      const groupResult = insertGroup.run(
        observationId,
        group.depth ?? null,
        group.weak_layer_type || null,
        group.weak_layer_grain_size || null,
        group.notes || null,
        groupIndex
      );

      const groupId = groupResult.lastInsertRowid as number;

      if (group.tests && group.tests.length > 0) {
        group.tests.forEach((test, testIndex) => {
          insertTest.run(
            groupId,
            test.test_type || null,
            test.taps || null,
            test.result || null,
            test.quality || null,
            test.cut || null,
            test.length || null,
            test.propagation || null,
            test.score || null,
            test.notes || null,
            testIndex
          );
        });
      }
    });
  }

  return { id: observationId };
}

// 更新观测记录
export function updateObservation(
  id: number,
  data: Partial<ObservationDetail>,
  userId: number
): boolean {
  const db = getDb();

  // 检查权限
  const existing = db.prepare('SELECT created_by FROM observations WHERE id = ?').get(id) as { created_by: number } | undefined;
  if (!existing) return false;

  // 更新主记录
  db.prepare(`
    UPDATE observations SET
      record_id = ?,
      location_description = ?,
      observer = ?,
      observation_date = ?,
      gps_coordinates = ?,
      elevation = ?,
      slope_aspect = ?,
      slope_angle = ?,
      total_snow_depth = ?,
      air_temperature = ?,
      weather = ?,
      boot_penetration = ?,
      wind = ?,
      blowing_snow = ?,
      conclusion = ?,
      diagram_x_axis_side = ?,
      diagram_y_axis_direction = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    data.record_id || null,
    data.location_description || null,
    data.observer || null,
    data.observation_date || null,
    data.gps_coordinates || null,
    data.elevation || null,
    data.slope_aspect || null,
    data.slope_angle || null,
    data.total_snow_depth || null,
    data.air_temperature || null,
    data.weather || null,
    data.boot_penetration || null,
    data.wind || null,
    data.blowing_snow || null,
    data.conclusion || null,
    data.diagram_x_axis_side || 'left',
    data.diagram_y_axis_direction || 'down',
    id
  );

  // 删除旧的雪层数据并重新插入
  db.prepare('DELETE FROM snow_layers WHERE observation_id = ?').run(id);

  if (data.snow_layers && data.snow_layers.length > 0) {
    const insertLayer = db.prepare(`
      INSERT INTO snow_layers (
        observation_id, start_depth, end_depth, temperature, hardness,
        crystal_type, grain_size, wetness, notes, hardness_top,
        hardness_bottom, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    data.snow_layers.forEach((layer, index) => {
      insertLayer.run(
        id,
        layer.start_depth ?? null,
        layer.end_depth ?? null,
        layer.temperature || null,
        layer.hardness || null,
        layer.crystal_type || null,
        layer.grain_size || null,
        layer.wetness || null,
        layer.notes || null,
        layer.hardness_top ?? null,
        layer.hardness_bottom ?? null,
        index
      );
    });
  }

  // 删除旧的测试数据
  const oldGroups = db.prepare('SELECT id FROM stability_test_groups WHERE observation_id = ?').all(id) as { id: number }[];
  for (const group of oldGroups) {
    db.prepare('DELETE FROM stability_tests WHERE group_id = ?').run(group.id);
  }
  db.prepare('DELETE FROM stability_test_groups WHERE observation_id = ?').run(id);

  // 重新插入测试数据
  if (data.stability_test_groups && data.stability_test_groups.length > 0) {
    const insertGroup = db.prepare(`
      INSERT INTO stability_test_groups (
        observation_id, depth, weak_layer_type, weak_layer_grain_size,
        notes, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertTest = db.prepare(`
      INSERT INTO stability_tests (
        group_id, test_type, taps, result, quality, cut, length,
        propagation, score, notes, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    data.stability_test_groups.forEach((group, groupIndex) => {
      const groupResult = insertGroup.run(
        id,
        group.depth ?? null,
        group.weak_layer_type || null,
        group.weak_layer_grain_size || null,
        group.notes || null,
        groupIndex
      );

      const groupId = groupResult.lastInsertRowid as number;

      if (group.tests && group.tests.length > 0) {
        group.tests.forEach((test, testIndex) => {
          insertTest.run(
            groupId,
            test.test_type || null,
            test.taps || null,
            test.result || null,
            test.quality || null,
            test.cut || null,
            test.length || null,
            test.propagation || null,
            test.score || null,
            test.notes || null,
            testIndex
          );
        });
      }
    });
  }

  return true;
}

// 删除观测记录
export function deleteObservation(id: number): boolean {
  const db = getDb();

  // 级联删除会自动处理子表
  const result = db.prepare('DELETE FROM observations WHERE id = ?').run(id);
  return result.changes > 0;
}

// 检查用户是否有权限操作观测记录
export function canUserAccessObservation(
  observationId: number,
  userId: number,
  userRole: string
): boolean {
  if (userRole === 'admin') return true;

  const db = getDb();
  const observation = db.prepare('SELECT created_by FROM observations WHERE id = ?').get(observationId) as { created_by: number } | undefined;

  if (!observation) return false;
  return observation.created_by === userId;
}
