interface ActionConfig {
  url: string;
  fetchMethod: (url: string, ...arg: Array<any>) => Promise<any>;
  params?: any;
  formatPrevData?: ((pd: any, cd: any) => any);
  onSuccess?: (e: any, actionConfig: ActionConfig) => any;
  onFailed?: (e: any) => any;
}

type Action = (pD?: any) => Promise<any>;

class PipeScheduler {
  private actionList: Array<Action> = [];

  constructor() {}

  /**
   * 添加请求任务到队头
   * @param .url 请求url
   * @param {Function}.fetchMethod 请求方法函数
   * @param .params 请求参数
   * @param {Function}.formatPrevData  格式化上一个异步任务中的参数，用于处理后得到新的参数 默认为传递的请求参数
   * @param {Function}.onSuccess 请求成功操作
   * @param {Function}.onFailed 请求失败操作
   * @returns 当前的任务列表
   */
  add(actionConfig: ActionConfig) {
    this.actionList.unshift(async function(prevData: any) {
      const formatPrevData = actionConfig.formatPrevData || ((pd, cd) => cd);
      const onSuccess = actionConfig.onSuccess || (e => e);
      const onFailed = actionConfig.onFailed || (e => e);
      return new Promise((resolve, reject) => {
        actionConfig.fetchMethod(actionConfig.url, formatPrevData(prevData, actionConfig.params)).then(res => {
          onSuccess(res, actionConfig);
          resolve(res);
        }).catch(e => {
          onFailed(e);
          reject(e);
        });
      });
    });
    return this.actionList;
  }

  /**
   * 执行流水线操作
   * @returns 触发函数 调用后会依次执行任务列表中的任务并返回promise
   */
  excute() {
    /**
     * 异步组合函数
     * @param promiseList 任务列表 每一项是一个可以返回Promise的函数
     * 每个异步函数接受一个上个异步函数resolve的值作为输入
     */
    function composePromise(actionList: Array<Action>) {
      if (!actionList.length) return () => Promise.resolve();
      return actionList.reduce((a, b) => () => a().then((d) => b(d)));
    }
    const action = composePromise.call(this, this.actionList);
    return action;
  }
}

export default PipeScheduler;
