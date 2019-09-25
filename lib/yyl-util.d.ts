declare const util:IUtil;

type callback = (...args: any[any]) => any;
type anyObj = { [key: string]: any };

interface IUtil {
  /**
   * 支持 await 的数组递归
   * @param arr 任意数组
   * @param fn Promise 类回调函数
   */
  forEach(arr: any[], fn: callback): Promise<any>;
  /**
   * cmd 解析
   * @param processArgv process.env
   * @param typeMap 类型 map
   */
  cmdParse(processArgv: string[], typeMap?: ITypeMap): ICmdParseResult;
  /**
   * 缩写的 cmd 解析 如 -p 1 => { p: 1 }
   * @param argv process.env
   */
  shortEnvParse(argv: string[]): anyObj;
  /**
   * object 转 cmd 缩写形式 { p: 1 } => -p 1
   * @param obj 变量集合
   */
  shortEnvStringify(obj: anyObj): string;
  /**
   * 创建 async
   * @param fn async 回调函数
   * @param isMocha 是否使用在 mocha
   */
  makeAsync(fn: callback, isMocha: boolean): callback;
  /**
   * 创建 await 函数
   * @param fn 
   */
  makeAwait(fn: (next: () => void, reject: () =>  void) => void): Promise<any>;
  /**
   * 等待函数
   * @param ms 等待时间 单位 ms
   */
  waitFor(ms: number): Promise<void>;
  /**
   * object 转数组
   * @param ctx 待转对象 
   */
  makeArray(ctx: any): any[];
  /**
   * object 转义 {path: 1} => --path 1
   * @param obj 对象
   */
  envStringify(obj: anyObj): string;
  /**
   * cmd 解析 --path 1 => {path: 1}
   * @param env process.env
   */
  envParse(env: string[]): anyObj;
  /**
   * 判断类型
   * @param ctx 待判断对象
   */
  type(ctx: any): string;
  /**
   * object 继承
   * @param argv 继承对象
   */
  extend(...argv: any[]): anyObj;
  /**
   * version 匹配
   * @param ver1 版本 01
   * @param ver2 版本 02
   */
  matchVersion(ver1: string, ver2: string): boolean;
  /**
   * 版本对比
   * @param ver1 版本 01
   * @param ver2 版本 02
   */
  compareVersion(ver1: string, ver2:string): 1|-1|0;
  /**
   * 创建时间搓 YYYYMMDDhhmmss
   */
  makeCssJsDate(): string;
  /**
   * 清除 cache 方式请求
   * @param iPath 对象
   */
  requireJs(iPath: string): any;
  path: IUtilPath;
}
interface ITypeMap {
  env?: anyObj,
  shortEnv?: anyObj
}

interface IUtilPath {
  join(...argv: string[]): string;
  relative(...argv: string[]): string;
  resolve(...argv: string[]): string;
}
interface ICmdParseResult {
  cmds: string[];
  env: any;
  shortEnv: any;
}
export = util