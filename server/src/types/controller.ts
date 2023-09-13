import Router from "koa-router";
import Koa from "koa";

export type Controller = (router: Router<any, {}>) => void;
export type Ctx = Koa.ParameterizedContext<
  any,
  Router.IRouterParamContext<any, {}>,
  any
> & {
  request: any;
};
