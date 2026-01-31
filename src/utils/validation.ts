import type { ObservationEditorState } from '../store/observation.store';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateObservation(editor: ObservationEditorState): ValidationError[] {
  const errors: ValidationError[] = [];

  // 基本信息
  if (!editor.info.observer || editor.info.observer.trim() === '') {
    errors.push({
      field: 'observer',
      message: '观测者姓名不能为空'
    });
  }

  if (!editor.info.date || editor.info.date.trim() === '') {
    errors.push({
      field: 'date',
      message: '观测日期不能为空'
    });
  } else {
    // 验证日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(editor.info.date)) {
      errors.push({
        field: 'date',
        message: '观测日期格式不正确，请使用 YYYY-MM-DD 格式'
      });
    }
  }

  if (!editor.info.locationDescription || editor.info.locationDescription.trim() === '') {
    errors.push({
      field: 'locationDescription',
      message: '观测地点描述不能为空'
    });
  }

  // 可选字段验证（如果填写了，验证格式）
  if (editor.info.elevation && editor.info.elevation.trim() !== '') {
    const elevation = parseFloat(editor.info.elevation);
    if (isNaN(elevation) || elevation < 0 || elevation > 10000) {
      errors.push({
        field: 'elevation',
        message: '海拔必须是0-10000之间的数字'
      });
    }
  }

  if (editor.info.slopeAngle && editor.info.slopeAngle.trim() !== '') {
    const angle = parseFloat(editor.info.slopeAngle);
    if (isNaN(angle) || angle < 0 || angle > 90) {
      errors.push({
        field: 'slopeAngle',
        message: '坡度必须是0-90之间的数字'
      });
    }
  }

  if (editor.info.totalSnowDepth && editor.info.totalSnowDepth.trim() !== '') {
    const depth = parseFloat(editor.info.totalSnowDepth);
    if (isNaN(depth) || depth < 0 || depth > 1000) {
      errors.push({
        field: 'totalSnowDepth',
        message: '总雪深必须是0-1000之间的数字'
      });
    }
  }

  if (editor.info.airTemperature && editor.info.airTemperature.trim() !== '') {
    // 支持负数，比如-5, -10.5
    const temp = parseFloat(editor.info.airTemperature);
    if (isNaN(temp) || temp < -50 || temp > 50) {
      errors.push({
        field: 'airTemperature',
        message: '气温必须是-50到50之间的数字'
      });
    }
  }

  // 验证雪层数据
  if (editor.layerRows.length > 0) {
    const totalHS = editor.info.totalSnowDepth ? parseFloat(editor.info.totalSnowDepth) : 0;
    let maxTopDepth = 0;

    editor.layerRows.forEach((layer: any, index: number) => {
      // 检查层顶深度是否合理
      const topDepth = layer.topDepth === '' ? null : parseFloat(layer.topDepth);

      if (topDepth !== null) {
        if (topDepth < 0 || topDepth > 1000) {
          errors.push({
            field: `layerRows[${index}].topDepth`,
            message: `雪层${index + 1}的层顶深度必须是0-1000之间的数字`
          });
        }
        if (topDepth > maxTopDepth) {
          maxTopDepth = topDepth;
        }
      }
    });

    // 检查最大深度是否超过总雪深
    if (totalHS > 0 && maxTopDepth > totalHS) {
      errors.push({
        field: 'layerRows',
        message: `雪层最大深度(${maxTopDepth}cm)超过了总雪深(${totalHS}cm)`
      });
    }
  }

  // 验证稳定性测试数据
  if (editor.stabilityGroups.length > 0) {
    editor.stabilityGroups.forEach((group, groupIndex) => {
      if (group.depth && group.depth.toString().trim() !== '') {
        const depth = parseFloat(group.depth.toString());
        if (isNaN(depth) || depth < 0 || depth > 1000) {
          errors.push({
            field: `stabilityGroups[${groupIndex}].depth`,
            message: `测试组${groupIndex + 1}的深度必须是0-1000之间的数字`
          });
        }
      }

      // 验证测试数据
      group.tests.forEach((test, testIndex) => {
        if (test.taps && test.taps.toString().trim() !== '') {
          const taps = parseInt(test.taps.toString());
          if (isNaN(taps) || taps < 1 || taps > 30) {
            errors.push({
              field: `stabilityGroups[${groupIndex}].tests[${testIndex}].taps`,
              message: `测试${groupIndex + 1}-${testIndex + 1}的敲击次数必须是1-30之间的整数`
            });
          }
        }

        if (test.cut && test.cut.toString().trim() !== '') {
          const cut = parseInt(test.cut.toString());
          if (isNaN(cut) || cut < 1 || cut > 30) {
            errors.push({
              field: `stabilityGroups[${groupIndex}].tests[${testIndex}].cut`,
              message: `测试${groupIndex + 1}-${testIndex + 1}的切割深度必须是1-30之间的整数`
            });
          }
        }

        if (test.length && test.length.toString().trim() !== '') {
          const length = parseInt(test.length.toString());
          if (isNaN(length) || length < 1 || length > 100) {
            errors.push({
              field: `stabilityGroups[${groupIndex}].tests[${testIndex}].length`,
              message: `测试${groupIndex + 1}-${testIndex + 1}的长度必须是1-100之间的整数`
            });
          }
        }

        if (test.score && test.score.toString().trim() !== '') {
          // 评分通常是 0-3 或类似的分数
          const score = parseInt(test.score.toString());
          if (isNaN(score) || score < 0 || score > 10) {
            errors.push({
              field: `stabilityGroups[${groupIndex}].tests[${testIndex}].score`,
              message: `测试${groupIndex + 1}-${testIndex + 1}的评分必须是0-10之间的整数`
            });
          }
        }
      });
    });
  }

  return errors;
}

export function getErrorMessage(error: ValidationError): string {
  return error.message;
}

export function getFieldError(errors: ValidationError[], fieldName: string): string | null {
  const error = errors.find(e => e.field === fieldName);
  return error ? error.message : null;
}