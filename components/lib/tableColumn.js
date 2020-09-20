/**
 * TableColumn defines column structure of the table
 * @see https://ant.design/components/table/
 * @param {string} title Title of the column
 * @param {string} key Key of the column
 * @param {string | string[]} dataIndex Data index of the column
 * @param {*} render Custom renderer function
 * @param {*} filterSortCfg
 */
export function TableColumn(title, key, dataIndex, render, filterSortCfg) {
  this.title = title;
  this.key = key;
  this.dataIndex = dataIndex;
  if (render) {
    this.render = render;
  }
  if (filterSortCfg) {
    const {
      filters,
      filterMultiple,
      onFilter,
      sorter,
      sortDirections,
    } = filterSortCfg;
    this.filters = filters;
    this.filterMultiple = filterMultiple;
    this.onFilter = onFilter;
    this.sorter = sorter;
    this.sortDirectinos = sortDirections;
  }
}
