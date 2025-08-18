import request from "./request";

export const ENDPOINT_URL = {
  POSTS_BY_IDS: "/kol/api/v4/tweet/",
  GET_PRICE: "/kol/api/v4/price/",
  POSTS_LIST: "/kol/api/v4/tweets/",
  GET_INDEX_DATA: "/kol/api/v4/index/",
};

/**
 * 根据推文ID获取推文
 * @param params 推文ID
 * @returns 推文
 */
export interface IGetPostsParams {
  tweet_id: string;
}
export const getPosts = async (params: IGetPostsParams) => {
  return request.get(ENDPOINT_URL.POSTS_BY_IDS, { ...params });
};

/**
 * 获取价格
 * @param params 用户名
 * @returns 价格
 */
export interface IGetPriceParams {
  screen_name: string;
}
export interface IGetPriceData {
  bins: number[];
  /**
   * 所在区间的下标，是从0开始的
   */
  current_bin: number;
  /**
   * 当前KOL价格
   */
  current_value: number;
  data: number[];
  kol: Kol;
  /**
   * 领先百分比
   */
  leading_percentage: number;
}

export interface Kol {
  name: string;
  profile_image_url: string;
  screen_name: string;
}
export const getPrice = async (params: IGetPriceParams) => {
  return request.get<IGetPriceData>(ENDPOINT_URL.GET_PRICE, { ...params });
};

// 获取推文列表
export const getPostsList = async () => {
  return request.get(ENDPOINT_URL.POSTS_LIST);
};

// 首页数据
export const getIndexData = async () => {
  return request.get(ENDPOINT_URL.GET_INDEX_DATA);
};
