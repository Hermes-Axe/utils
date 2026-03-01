import { reactive, ref } from 'vue'

const DEFAULT_OPTIONS = {
  totalKey: 'total',
  totalPageKey: 'totalPages',
  pageSize: 10
}

interface OptionsType {
  totalKey?: string;
  totalPageKey?: string;
  pageSize?: number;
}

/**
 * useTable
 * @param getTableDataFun {Function} 传入具体业务参数调用接口，需要将接口调用返回的数据以Promise的方式返回供后续使用
 * @param options {Object} 配置项 { totalKey: 'total', totalPageKey: 'totalPages', pageSize: 10 }
 * @returns
 */
export default function useTable(requestFun: Function, options: OptionsType = DEFAULT_OPTIONS) {
  const {
    pageSize = DEFAULT_OPTIONS.pageSize,
    totalKey = DEFAULT_OPTIONS.totalKey,
    totalPageKey = DEFAULT_OPTIONS.totalPageKey
  } = options

  const pageParam = reactive({
    pageSize,
    pageNum: 1,
    totalItems: 0,
    totalPages: 0,
  })

  const tableLoading = ref(false)

  /**
   * 分页器页码 change
   */
  const handlePageChangeCurrent = () => {
    getTableData()
  }

  /**
   * 分页器 size change
   */
  const handlePageSizeChange = () => {
    pageParam.pageNum = 1
    getTableData()
  }

  /**
   * 执行请求获取列表
   */
  const getTableData = () => {
    tableLoading.value = true
    let res = requestFun()
    if (!(res instanceof Promise)) {
      res = Promise.resolve(res)
    }
    res
      .then((res: any) => {
        pageParam.totalItems = res?.data[totalKey] || 0
        pageParam.totalPages = res?.data[totalPageKey] || 0
      })
      .catch((err: any) => {
        console.log('[useTable]Internal Error:', err);
      })
      .finally(() => {
        tableLoading.value = false
      })
  }

  /**
   * 计算当前列表序号
   * @param index {number} 项目在当前列表的序号
   * @returns number
   */
  const currentItemIndex = (index: number) => {
    if (index < 0) return 1
    return index + 1 + (pageParam.pageNum - 1) * pageParam.pageSize
  }

  /**
   * 列表搜索 重置当前页码为第一页
   */
  const handleSearch = () => {
    pageParam.pageNum = 1
    getTableData()
  }
  return {
    tableLoading,
    pageParam,
    currentItemIndex,
    handlePageChangeCurrent,
    handlePageSizeChange,
    handleSearch,
    getTableData
  }
}