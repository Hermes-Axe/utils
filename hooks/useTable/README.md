# useTable

## 作用

对表格常用的分页方式进行hook封装

## 何时使用

有大量接口结构相同的列表页面时可引入

## 如何使用

1. 引入useTable
2. 创建获取列表数据的方法requestList
需要通过Promise返回全部的响应数据便于内部逻辑取出分页信息，具体情况要结合接口返回的数据结构进行判断
3. 将requestList作为参数传入useTable，并解构出需要用到的方法和数据
4. 直接使用即可

```js
import useTable from '@/utils/useTable'

/*
 接口返回格式
 {
  code: 0,
  data: {
    rows: [],
    total: 10,
    pages: 5,
  }
 }
*/
const tableData = ref([])
const requestList = async() => {
  const res = await axios.get('/api/listPage')
  tableData.value = res?.data?.rows || []
  return res
}

const {
  tableLoading, // 表格loading
  pageParam,    // 分页参数
  currentItemIndex, // 当前行索引 接收一个下标$index参数
  handlePageChangeCurrent, // 切换页码
  handlePageSizeChange, // 切换分页大小
  handleSearch, // 搜索
  getTableData  // 获取列表数据
} = useTable(requestList)

onMounted(getTableData)
```
