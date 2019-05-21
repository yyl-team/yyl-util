declare const util:IUtil;

type callback = (...args: any[any]) => any;
type anyObj = { [key: string]: any };

interface IUtil {
  forEach(arr: any[], fn: callback): Promise<any>;
  cmdParse(processArgv: string[]): ICmdParseResult;
  shortEnvParse(argv: string[]): anyObj;
  shortEnvStringify(obj: anyObj): string;
  makeAsync(fn: callback, isMocha: boolean): callback;
  makeAwait(fn: callback): Promise<any>;
  waitFor(ms: number): Promise<void>;
  makeArray(ctx: any): any[];
  envStringify(obj: anyObj): string;
  envParse(env: string[]): anyObj;
  type(ctx: any): string;
  extend(...argv: any[]): anyObj;
  matchVersion(ver1: string, ver2: string): boolean;
  compareVersion(ver1: string, ver2:string): 1|-1|0;
  makeCssJsDate(): string;
  requireJs(iPath: string): any;
  path: IUtilPath;
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