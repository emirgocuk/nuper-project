# TanStack Table
Source: https://antigravity.codes/agent-skills/react/tanstack-table

## AI Worker Instructions
When the user requests functionality related to TanStack Table, follow these guidelines and utilize this context.

## Scraped Content

# TanStack Table
```
npm install @tanstack/react-table@latestnpm install @tanstack/react-virtual@latest  # For virtualization
```
```
npm install @tanstack/react-table@latestnpm install @tanstack/react-virtual@latest  # For virtualization
```
```
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table'import { useMemo } from 'react'const columns: ColumnDef<User>[] = [  { accessorKey: 'name', header: 'Name' },  { accessorKey: 'email', header: 'Email' },]function UsersTable() {  const data = useMemo(() => [...users], []) // Stable reference  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })  return (    <table>      <thead>        {table.getHeaderGroups().map(group => (          <tr key={group.id}>            {group.headers.map(h => <th key={h.id}>{h.column.columnDef.header}</th>)}          </tr>        ))}      </thead>      <tbody>        {table.getRowModel().rows.map(row => (          <tr key={row.id}>            {row.getVisibleCells().map(cell => <td key={cell.id}>{cell.renderValue()}</td>)}          </tr>        ))}      </tbody>    </table>  )}
```
```
import { useReactTable, getCoreRowModel, ColumnDef } from '@tanstack/react-table'import { useMemo } from 'react'const columns: ColumnDef<User>[] = [  { accessorKey: 'name', header: 'Name' },  { accessorKey: 'email', header: 'Email' },]function UsersTable() {  const data = useMemo(() => [...users], []) // Stable reference  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })  return (    <table>      <thead>        {table.getHeaderGroups().map(group => (          <tr key={group.id}>            {group.headers.map(h => <th key={h.id}>{h.column.columnDef.header}</th>)}          </tr>        ))}      </thead>      <tbody>        {table.getRowModel().rows.map(row => (          <tr key={row.id}>            {row.getVisibleCells().map(cell => <td key={cell.id}>{cell.renderValue()}</td>)}          </tr>        ))}      </tbody>    </table>  )}
```
```
// Workers API: functions/api/users.tsexport async function onRequestGet({ request, env }) {  const url = new URL(request.url)  const page = Number(url.searchParams.get('page')) || 0  const pageSize = 20  const search = url.searchParams.get('search') || ''  const sortBy = url.searchParams.get('sortBy') || 'created_at'  const sortOrder = url.searchParams.get('sortOrder') || 'DESC'  const { results } = await env.DB.prepare(    SELECT * FROM users    WHERE name LIKE ? OR email LIKE ?    ORDER BY ${sortBy} ${sortOrder}    LIMIT ? OFFSET ?  ).bind(%${search}%, %${search}%, pageSize, page * pageSize).all()  const { total } = await env.DB.prepare('SELECT COUNT(*) as total FROM users').first()  return Response.json({    data: results,    pagination: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) },  })}
```
```
// Workers API: functions/api/users.tsexport async function onRequestGet({ request, env }) {  const url = new URL(request.url)  const page = Number(url.searchParams.get('page')) || 0  const pageSize = 20  const search = url.searchParams.get('search') || ''  const sortBy = url.searchParams.get('sortBy') || 'created_at'  const sortOrder = url.searchParams.get('sortOrder') || 'DESC'  const { results } = await env.DB.prepare(    SELECT * FROM users    WHERE name LIKE ? OR email LIKE ?    ORDER BY ${sortBy} ${sortOrder}    LIMIT ? OFFSET ?  ).bind(%${search}%, %${search}%, pageSize, page * pageSize).all()  const { total } = await env.DB.prepare('SELECT COUNT(*) as total FROM users').first()  return Response.json({    data: results,    pagination: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) },  })}
```
```
SELECT * FROM users    WHERE name LIKE ? OR email LIKE ?    ORDER BY ${sortBy} ${sortOrder}    LIMIT ? OFFSET ?
```
```
%${search}%
```
```
%${search}%
```
```
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })const [columnFilters, setColumnFilters] = useState([])const [sorting, setSorting] = useState([])// CRITICAL: Include ALL state in query keyconst { data, isLoading } = useQuery({  queryKey: ['users', pagination, columnFilters, sorting],  queryFn: async () => {    const params = new URLSearchParams({      page: pagination.pageIndex,      search: columnFilters.find(f => f.id === 'search')?.value || '',      sortBy: sorting[0]?.id || 'created_at',      sortOrder: sorting[0]?.desc ? 'DESC' : 'ASC',    })    return fetch(/api/users?${params}).then(r => r.json())  },})const table = useReactTable({  data: data?.data ?? [],  columns,  getCoreRowModel: getCoreRowModel(),  // CRITICAL: manual* flags tell table server handles these  manualPagination: true,  manualFiltering: true,  manualSorting: true,  pageCount: data?.pagination.pageCount ?? 0,  state: { pagination, columnFilters, sorting },  onPaginationChange: setPagination,  onColumnFiltersChange: setColumnFilters,  onSortingChange: setSorting,})
```
```
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })const [columnFilters, setColumnFilters] = useState([])const [sorting, setSorting] = useState([])// CRITICAL: Include ALL state in query keyconst { data, isLoading } = useQuery({  queryKey: ['users', pagination, columnFilters, sorting],  queryFn: async () => {    const params = new URLSearchParams({      page: pagination.pageIndex,      search: columnFilters.find(f => f.id === 'search')?.value || '',      sortBy: sorting[0]?.id || 'created_at',      sortOrder: sorting[0]?.desc ? 'DESC' : 'ASC',    })    return fetch(/api/users?${params}).then(r => r.json())  },})const table = useReactTable({  data: data?.data ?? [],  columns,  getCoreRowModel: getCoreRowModel(),  // CRITICAL: manual* flags tell table server handles these  manualPagination: true,  manualFiltering: true,  manualSorting: true,  pageCount: data?.pagination.pageCount ?? 0,  state: { pagination, columnFilters, sorting },  onPaginationChange: setPagination,  onColumnFiltersChange: setColumnFilters,  onSortingChange: setSorting,})
```
```
/api/users?${params}
```
```
import { useVirtualizer } from '@tanstack/react-virtual'function VirtualizedTable() {  const containerRef = useRef<HTMLDivElement>(null)  const table = useReactTable({ data: largeDataset, columns, getCoreRowModel: getCoreRowModel() })  const { rows } = table.getRowModel()  const rowVirtualizer = useVirtualizer({    count: rows.length,    getScrollElement: () => containerRef.current,    estimateSize: () => 50, // Row height px    overscan: 10,  })  return (    <div ref={containerRef} style={{ height: '600px', overflow: 'auto' }}>      <table style={{ height: ${rowVirtualizer.getTotalSize()}px }}>        <tbody>          {rowVirtualizer.getVirtualItems().map(virtualRow => {            const row = rows[virtualRow.index]            return (              <tr key={row.id} style={{ position: 'absolute', transform: translateY(${virtualRow.start}px) }}>                {row.getVisibleCells().map(cell => <td key={cell.id}>{cell.renderValue()}</td>)}              </tr>            )          })}        </tbody>      </table>    </div>  )}
```
```
import { useVirtualizer } from '@tanstack/react-virtual'function VirtualizedTable() {  const containerRef = useRef<HTMLDivElement>(null)  const table = useReactTable({ data: largeDataset, columns, getCoreRowModel: getCoreRowModel() })  const { rows } = table.getRowModel()  const rowVirtualizer = useVirtualizer({    count: rows.length,    getScrollElement: () => containerRef.current,    estimateSize: () => 50, // Row height px    overscan: 10,  })  return (    <div ref={containerRef} style={{ height: '600px', overflow: 'auto' }}>      <table style={{ height: ${rowVirtualizer.getTotalSize()}px }}>        <tbody>          {rowVirtualizer.getVirtualItems().map(virtualRow => {            const row = rows[virtualRow.index]            return (              <tr key={row.id} style={{ position: 'absolute', transform: translateY(${virtualRow.start}px) }}>                {row.getVisibleCells().map(cell => <td key={cell.id}>{cell.renderValue()}</td>)}              </tr>            )          })}        </tbody>      </table>    </div>  )}
```
```
${rowVirtualizer.getTotalSize()}px
```
```
translateY(${virtualRow.start}px)
```
```
display: none
```
```
const rowVirtualizer = useVirtualizer({  count: rows.length,  getScrollElement: () => containerRef.current,  estimateSize: () => 50,  overscan: 10,  // Disable when container is hidden to prevent infinite re-renders  enabled: containerRef.current?.getClientRects().length !== 0,})// OR: Conditionally render instead of hiding with CSS{isVisible && <VirtualizedTable />}
```
```
const rowVirtualizer = useVirtualizer({  count: rows.length,  getScrollElement: () => containerRef.current,  estimateSize: () => 50,  overscan: 10,  // Disable when container is hidden to prevent infinite re-renders  enabled: containerRef.current?.getClientRects().length !== 0,})// OR: Conditionally render instead of hiding with CSS{isVisible && <VirtualizedTable />}
```
```
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'const table = useReactTable({  data,  columns,  getCoreRowModel: getCoreRowModel(),  // Enable pinning  enableColumnPinning: true,  enableRowPinning: true,  // Initial pinning state  initialState: {    columnPinning: {      left: ['select', 'name'],  // Pin to left      right: ['actions'],        // Pin to right    },  },})// Render with pinned columnsfunction PinnedTable() {  return (    <div className="flex">      {/* Left pinned columns */}      <div className="sticky left-0 bg-background z-10">        {table.getLeftHeaderGroups().map(/* render left headers */)}        {table.getRowModel().rows.map(row => (          <tr>{row.getLeftVisibleCells().map(/* render cells */)}</tr>        ))}      </div>      {/* Center scrollable columns */}      <div className="overflow-x-auto">        {table.getCenterHeaderGroups().map(/* render center headers */)}        {table.getRowModel().rows.map(row => (          <tr>{row.getCenterVisibleCells().map(/* render cells */)}</tr>        ))}      </div>      {/* Right pinned columns */}      <div className="sticky right-0 bg-background z-10">        {table.getRightHeaderGroups().map(/* render right headers */)}        {table.getRowModel().rows.map(row => (          <tr>{row.getRightVisibleCells().map(/* render cells */)}</tr>        ))}      </div>    </div>  )}// Toggle pinning programmaticallycolumn.pin('left')   // Pin column to leftcolumn.pin('right')  // Pin column to rightcolumn.pin(false)    // Unpin columnrow.pin('top')       // Pin row to toprow.pin('bottom')    // Pin row to bottom
```
```
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'const table = useReactTable({  data,  columns,  getCoreRowModel: getCoreRowModel(),  // Enable pinning  enableColumnPinning: true,  enableRowPinning: true,  // Initial pinning state  initialState: {    columnPinning: {      left: ['select', 'name'],  // Pin to left      right: ['actions'],        // Pin to right    },  },})// Render with pinned columnsfunction PinnedTable() {  return (    <div className="flex">      {/* Left pinned columns */}      <div className="sticky left-0 bg-background z-10">        {table.getLeftHeaderGroups().map(/* render left headers */)}        {table.getRowModel().rows.map(row => (          <tr>{row.getLeftVisibleCells().map(/* render cells */)}</tr>        ))}      </div>      {/* Center scrollable columns */}      <div className="overflow-x-auto">        {table.getCenterHeaderGroups().map(/* render center headers */)}        {table.getRowModel().rows.map(row => (          <tr>{row.getCenterVisibleCells().map(/* render cells */)}</tr>        ))}      </div>      {/* Right pinned columns */}      <div className="sticky right-0 bg-background z-10">        {table.getRightHeaderGroups().map(/* render right headers */)}        {table.getRowModel().rows.map(row => (          <tr>{row.getRightVisibleCells().map(/* render cells */)}</tr>        ))}      </div>    </div>  )}// Toggle pinning programmaticallycolumn.pin('left')   // Pin column to leftcolumn.pin('right')  // Pin column to rightcolumn.pin(false)    // Unpin columnrow.pin('top')       // Pin row to toprow.pin('bottom')    // Pin row to bottom
```
```
columnHelper.group()
```
```
column.getStart('left')
```
```
// Disable pinning for grouped columnsconst isPinnable = (column) => !column.parent// OR: Pin individual columns within group, not the group itselftable.getColumn('firstName')?.pin('left')table.getColumn('lastName')?.pin('left')// Don't pin the parent group column
```
```
// Disable pinning for grouped columnsconst isPinnable = (column) => !column.parent// OR: Pin individual columns within group, not the group itselftable.getColumn('firstName')?.pin('left')table.getColumn('lastName')?.pin('left')// Don't pin the parent group column
```
```
import { useReactTable, getCoreRowModel, getExpandedRowModel } from '@tanstack/react-table'// Data with nested childrenconst data = [  {    id: 1,    name: 'Parent Row',    subRows: [      { id: 2, name: 'Child Row 1' },      { id: 3, name: 'Child Row 2' },    ],  },]const table = useReactTable({  data,  columns,  getCoreRowModel: getCoreRowModel(),  getExpandedRowModel: getExpandedRowModel(),  // Required for expanding  getSubRows: row => row.subRows,               // Tell table where children are})// Render with expand buttonfunction ExpandableTable() {  return (    <tbody>      {table.getRowModel().rows.map(row => (        <>          <tr key={row.id}>            <td>              {row.getCanExpand() && (                <button onClick={row.getToggleExpandedHandler()}>                  {row.getIsExpanded() ? '▼' : '▶'}                </button>              )}            </td>            {row.getVisibleCells().map(cell => (              <td key={cell.id} style={{ paddingLeft: ${row.depth * 20}px }}>                {cell.renderValue()}              </td>            ))}          </tr>        </>      ))}    </tbody>  )}// Control expansion programmaticallytable.toggleAllRowsExpanded()     // Expand/collapse allrow.toggleExpanded()              // Toggle single rowtable.getIsAllRowsExpanded()      // Check if all expanded
```
```
import { useReactTable, getCoreRowModel, getExpandedRowModel } from '@tanstack/react-table'// Data with nested childrenconst data = [  {    id: 1,    name: 'Parent Row',    subRows: [      { id: 2, name: 'Child Row 1' },      { id: 3, name: 'Child Row 2' },    ],  },]const table = useReactTable({  data,  columns,  getCoreRowModel: getCoreRowModel(),  getExpandedRowModel: getExpandedRowModel(),  // Required for expanding  getSubRows: row => row.subRows,               // Tell table where children are})// Render with expand buttonfunction ExpandableTable() {  return (    <tbody>      {table.getRowModel().rows.map(row => (        <>          <tr key={row.id}>            <td>              {row.getCanExpand() && (                <button onClick={row.getToggleExpandedHandler()}>                  {row.getIsExpanded() ? '▼' : '▶'}                </button>              )}            </td>            {row.getVisibleCells().map(cell => (              <td key={cell.id} style={{ paddingLeft: ${row.depth * 20}px }}>                {cell.renderValue()}              </td>            ))}          </tr>        </>      ))}    </tbody>  )}// Control expansion programmaticallytable.toggleAllRowsExpanded()     // Expand/collapse allrow.toggleExpanded()              // Toggle single rowtable.getIsAllRowsExpanded()      // Check if all expanded
```
```
${row.depth * 20}px
```
```
function DetailRow({ row }) {  if (!row.getIsExpanded()) return null  return (    <tr>      <td colSpan={columns.length}>        <div className="p-4 bg-muted">          Custom detail content for row {row.id}        </div>      </td>    </tr>  )}
```
```
function DetailRow({ row }) {  if (!row.getIsExpanded()) return null  return (    <tr>      <td colSpan={columns.length}>        <div className="p-4 bg-muted">          Custom detail content for row {row.id}        </div>      </td>    </tr>  )}
```
```
import { useReactTable, getCoreRowModel, getGroupedRowModel } from '@tanstack/react-table'const table = useReactTable({  data,  columns,  getCoreRowModel: getCoreRowModel(),  getGroupedRowModel: getGroupedRowModel(),    // Required for grouping  getExpandedRowModel: getExpandedRowModel(),  // Groups are expandable  initialState: {    grouping: ['status'],  // Group by 'status' column  },})// Column with aggregationconst columns = [  {    accessorKey: 'status',    header: 'Status',  },  {    accessorKey: 'amount',    header: 'Amount',    aggregationFn: 'sum',                      // Sum grouped values    aggregatedCell: ({ getValue }) => Total: ${getValue()},  },]// Render grouped tablefunction GroupedTable() {  return (    <tbody>      {table.getRowModel().rows.map(row => (        <tr key={row.id}>          {row.getVisibleCells().map(cell => (            <td key={cell.id}>              {cell.getIsGrouped() ? (                // Grouped cell - show group header with expand toggle                <button onClick={row.getToggleExpandedHandler()}>                  {row.getIsExpanded() ? '▼' : '▶'} {cell.renderValue()} ({row.subRows.length})                </button>              ) : cell.getIsAggregated() ? (                // Aggregated cell - show aggregation result                cell.renderValue()              ) : cell.getIsPlaceholder() ? null : (                // Regular cell                cell.renderValue()              )}            </td>          ))}        </tr>      ))}    </tbody>  )}// Built-in aggregation functions// 'sum', 'min', 'max', 'extent', 'mean', 'median', 'unique', 'uniqueCount', 'count'
```
```
import { useReactTable, getCoreRowModel, getGroupedRowModel } from '@tanstack/react-table'const table = useReactTable({  data,  columns,  getCoreRowModel: getCoreRowModel(),  getGroupedRowModel: getGroupedRowModel(),    // Required for grouping  getExpandedRowModel: getExpandedRowModel(),  // Groups are expandable  initialState: {    grouping: ['status'],  // Group by 'status' column  },})// Column with aggregationconst columns = [  {    accessorKey: 'status',    header: 'Status',  },  {    accessorKey: 'amount',    header: 'Amount',    aggregationFn: 'sum',                      // Sum grouped values    aggregatedCell: ({ getValue }) => Total: ${getValue()},  },]// Render grouped tablefunction GroupedTable() {  return (    <tbody>      {table.getRowModel().rows.map(row => (        <tr key={row.id}>          {row.getVisibleCells().map(cell => (            <td key={cell.id}>              {cell.getIsGrouped() ? (                // Grouped cell - show group header with expand toggle                <button onClick={row.getToggleExpandedHandler()}>                  {row.getIsExpanded() ? '▼' : '▶'} {cell.renderValue()} ({row.subRows.length})                </button>              ) : cell.getIsAggregated() ? (                // Aggregated cell - show aggregation result                cell.renderValue()              ) : cell.getIsPlaceholder() ? null : (                // Regular cell                cell.renderValue()              )}            </td>          ))}        </tr>      ))}    </tbody>  )}// Built-in aggregation functions// 'sum', 'min', 'max', 'extent', 'mean', 'median', 'unique', 'uniqueCount', 'count'
```
```
Total: ${getValue()}
```
```
createRow
```
```
// 1. Use server-side grouping for large datasets// 2. Implement pagination to limit rows per page// 3. Disable grouping for 10k+ rowsconst shouldEnableGrouping = data.length < 10000// 4. OR: Use React.memo on row componentsconst MemoizedRow = React.memo(TableRow)
```
```
// 1. Use server-side grouping for large datasets// 2. Implement pagination to limit rows per page// 3. Disable grouping for 10k+ rowsconst shouldEnableGrouping = data.length < 10000// 4. OR: Use React.memo on row componentsconst MemoizedRow = React.memo(TableRow)
```
```
data
```
```
columns
```
```
useMemo(() => [...], [])
```
```
queryKey: ['users', pagination, columnFilters, sorting]
```
```
manual*
```
```
manualPagination: true
```
```
manualFiltering: true
```
```
manualSorting: true
```
```
pageCount
```
```
createColumnHelper
```
```
@tanstack/react-table
```
```
@tanstack/table-core
```
```
sorting
```
```
manualSorting: true
```
```
onSortingChange
```
```
"Table doesn't re-render when data changes"
```
```
"use no memo"
```
```
useReactTable
```
```
"use no memo"function TableComponent() {  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })  // Now works correctly with React Compiler}
```
```
"use no memo"function TableComponent() {  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })  // Now works correctly with React Compiler}
```
```
toggleAllRowsSelected(false)
```
```
const toggleAllRows = (value: boolean) => {  if (!value) {    table.setRowSelection({}) // Clear entire selection object  } else {    table.toggleAllRowsSelected(true)  }}
```
```
const toggleAllRows = (value: boolean) => {  if (!value) {    table.setRowSelection({}) // Clear entire selection object  } else {    table.toggleAllRowsSelected(true)  }}
```
```
onPaginationChange
```
```
pageIndex: 0
```
```
// Instead of relying on client-side paginationconst table = useReactTable({  data,  columns,  manualPagination: true, // Forces correct state tracking  pageCount: Math.ceil(data.length / pagination.pageSize),  state: { pagination },  onPaginationChange: setPagination,})
```
```
// Instead of relying on client-side paginationconst table = useReactTable({  data,  columns,  manualPagination: true, // Forces correct state tracking  pageCount: Math.ceil(data.length / pagination.pageSize),  state: { pagination },  onPaginationChange: setPagination,})
```
```
const removeRow = (idToRemove: string) => {  // Remove from data  setData(data.filter(row => row.id !== idToRemove))  // Clean up selection if it was selected  const { rowSelection } = table.getState()  if (rowSelection[idToRemove]) {    table.setRowSelection((old) => {      const filtered = Object.entries(old).filter(([id]) => id !== idToRemove)      return Object.fromEntries(filtered)    })  }}// OR: Use table.resetRowSelection(true) to clear all
```
```
const removeRow = (idToRemove: string) => {  // Remove from data  setData(data.filter(row => row.id !== idToRemove))  // Clean up selection if it was selected  const { rowSelection } = table.getState()  if (rowSelection[idToRemove]) {    table.setRowSelection((old) => {      const filtered = Object.entries(old).filter(([id]) => id !== idToRemove)      return Object.fromEntries(filtered)    })  }}// OR: Use table.resetRowSelection(true) to clear all
```
```
getValue()
```
```
unknown
```
```
columnHelper.group()
```
```
renderValue()
```
```
// Option 1: Type assertioncell: (info) => {  const value = info.getValue() as string  return value.toUpperCase()}// Option 2: Use renderValue() (better type inference)cell: (info) => {  const value = info.renderValue()  return typeof value === 'string' ? value.toUpperCase() : value}
```
```
// Option 1: Type assertioncell: (info) => {  const value = info.getValue() as string  return value.toUpperCase()}// Option 2: Use renderValue() (better type inference)cell: (info) => {  const value = info.renderValue()  return typeof value === 'string' ? value.toUpperCase() : value}
```
```
# ❌ Old package (v7)npm install react-table# ✅ New package (v8)npm install @tanstack/react-table
```
```
# ❌ Old package (v7)npm install react-table# ✅ New package (v8)npm install @tanstack/react-table
```
```
/* ❌ v7 useTable hook */import { useTable, useSortBy, usePagination } from 'react-table'const { getTableProps, getTableBodyProps, rows } = useTable(  { columns, data },  useSortBy,  usePagination)/* ✅ v8 useReactTable */import {  useReactTable,  getCoreRowModel,  getSortedRowModel,  getPaginationRowModel,} from '@tanstack/react-table'const table = useReactTable({  data,  columns,  getCoreRowModel: getCoreRowModel(),  getSortedRowModel: getSortedRowModel(),  getPaginationRowModel: getPaginationRowModel(),})
```
```
/* ❌ v7 useTable hook */import { useTable, useSortBy, usePagination } from 'react-table'const { getTableProps, getTableBodyProps, rows } = useTable(  { columns, data },  useSortBy,  usePagination)/* ✅ v8 useReactTable */import {  useReactTable,  getCoreRowModel,  getSortedRowModel,  getPaginationRowModel,} from '@tanstack/react-table'const table = useReactTable({  data,  columns,  getCoreRowModel: getCoreRowModel(),  getSortedRowModel: getSortedRowModel(),  getPaginationRowModel: getPaginationRowModel(),})
```
```
/* ❌ v7 columns */const columns = [  { Header: 'Name', accessor: 'name' },  { Header: 'Age', accessor: 'age' },]/* ✅ v8 columns with columnHelper */import { createColumnHelper } from '@tanstack/react-table'const columnHelper = createColumnHelper<Person>()const columns = [  columnHelper.accessor('name', {    header: 'Name',    cell: (info) => info.getValue(),  }),  columnHelper.accessor('age', {    header: 'Age',  }),]
```
```
/* ❌ v7 columns */const columns = [  { Header: 'Name', accessor: 'name' },  { Header: 'Age', accessor: 'age' },]/* ✅ v8 columns with columnHelper */import { createColumnHelper } from '@tanstack/react-table'const columnHelper = createColumnHelper<Person>()const columns = [  columnHelper.accessor('name', {    header: 'Name',    cell: (info) => info.getValue(),  }),  columnHelper.accessor('age', {    header: 'Age',  }),]
```
```
/* ❌ v7 rendering */<table {...getTableProps()}>  <tbody {...getTableBodyProps()}>    {rows.map(row => (      <tr {...row.getRowProps()}>        {row.cells.map(cell => (          <td {...cell.getCellProps()}>{cell.render('Cell')}</td>        ))}      </tr>    ))}  </tbody></table>/* ✅ v8 rendering */<table>  <tbody>    {table.getRowModel().rows.map((row) => (      <tr key={row.id}>        {row.getVisibleCells().map((cell) => (          <td key={cell.id}>            {flexRender(cell.column.columnDef.cell, cell.getContext())}          </td>        ))}      </tr>    ))}  </tbody></table>
```
```
/* ❌ v7 rendering */<table {...getTableProps()}>  <tbody {...getTableBodyProps()}>    {rows.map(row => (      <tr {...row.getRowProps()}>        {row.cells.map(cell => (          <td {...cell.getCellProps()}>{cell.render('Cell')}</td>        ))}      </tr>    ))}  </tbody></table>/* ✅ v8 rendering */<table>  <tbody>    {table.getRowModel().rows.map((row) => (      <tr key={row.id}>        {row.getVisibleCells().map((cell) => (          <td key={cell.id}>            {flexRender(cell.column.columnDef.cell, cell.getContext())}          </td>        ))}      </tr>    ))}  </tbody></table>
```
```
/* ❌ v7 sorting */const { setSortBy } = useTable(...)/* ✅ v8 sorting state */const [sorting, setSorting] = useState<SortingState>([])const table = useReactTable({  state: { sorting },  onSortingChange: setSorting,  getSortedRowModel: getSortedRowModel(),})
```
```
/* ❌ v7 sorting */const { setSortBy } = useTable(...)/* ✅ v8 sorting state */const [sorting, setSorting] = useState<SortingState>([])const table = useReactTable({  state: { sorting },  onSortingChange: setSorting,  getSortedRowModel: getSortedRowModel(),})
```
```
/* ❌ v7 pagination */const { pageIndex, pageSize, gotoPage } = useTable(...)/* ✅ v8 pagination */const [pagination, setPagination] = useState<PaginationState>({  pageIndex: 0,  pageSize: 10,})const table = useReactTable({  state: { pagination },  onPaginationChange: setPagination,  getPaginationRowModel: getPaginationRowModel(),})// Navigationtable.setPageIndex(0)table.nextPage()table.previousPage()
```
```
/* ❌ v7 pagination */const { pageIndex, pageSize, gotoPage } = useTable(...)/* ✅ v8 pagination */const [pagination, setPagination] = useState<PaginationState>({  pageIndex: 0,  pageSize: 10,})const table = useReactTable({  state: { pagination },  onPaginationChange: setPagination,  getPaginationRowModel: getPaginationRowModel(),})// Navigationtable.setPageIndex(0)table.nextPage()table.previousPage()
```
```
npm install react-table
```
```
npm install @tanstack/react-table
```
```
useTable
```
```
useReactTable
```
```
Header: 'Name'
```
```
header: 'Name'
```
```
accessor: 'name'
```
```
columnHelper.accessor('name', {...})
```
```
getTableProps()
```
```
row.cells
```
```
row.getVisibleCells()
```
```
cell.render('Cell')
```
```
flexRender(cell.column.columnDef.cell, cell.getContext())
```
The TanStack Table Agent Skill provides unparalleled assistance for implementing advanced data tables in your React applications. TanStack Table is a powerful, headless library that empowers developers to build highly customizable and performant tables, abstracting away complex state management for features like pagination, sorting, and filtering. This skill simplifies the integration process, offering expert guidance and code examples to quickly set up tables with server-side logic and virtualization. Ideal for projects requiring flexible data presentation, it helps you craft seamless user experiences, whether displaying small datasets or managing large-scale enterprise data.

# When to Use This Skill
- •Building a dashboard with dynamic, sortable, and filterable tables for displaying user data or product catalogs.
- •Implementing a data grid for an admin panel that requires server-side pagination and infinite scrolling with virtualization for large datasets.
- •Creating a custom UI table that integrates complex features like row selection, column reordering, and data aggregation, leveraging TanStack's headless API.
- •Developing a data-intensive application that needs to efficiently display thousands of records with optimal performance and a smooth user experience.

# Pro Tips
- 💡Always memoize your `data` and `columns` props passed to `useReactTable` to prevent unnecessary re-renders and optimize performance, as highlighted in the quick start.
- 💡Explore TanStack Table's extensive plugin ecosystem (e.g., column resizing, grouping) to add advanced features without manually implementing complex logic.
- 💡When dealing with large datasets, combine TanStack Table with `@tanstack/react-virtual` for efficient row and column virtualization, ensuring smooth scrolling and minimal DOM overhead.

