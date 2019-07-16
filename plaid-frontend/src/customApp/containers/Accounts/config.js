const localDataName = 'CM_Users';
const orderStatusOptions = ['Pending', 'Completed', 'Delivered', 'On Hold'];
const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    rowKey: 'no',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    rowKey: 'name',
  },
  {
		title: 'Official Name',
		dataIndex: 'official_name',
		rowKey: 'official_name',
	},
  {
    title: 'Mask',
    dataIndex: 'mask',
    rowKey: 'mask',
  },
	{
		title: 'Subtype',
		dataIndex: 'subtype',
		rowKey: 'subtype',
	},
  {
    title: 'Type',
    dataIndex: 'type',
    rowKey: 'type',
  },
  {
    title: 'Verification Status',
    dataIndex: 'verification_status',
    rowKey: 'verification_status',
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    rowKey: 'balance',
  },
];

export {
	columns,
	localDataName,
	orderStatusOptions,
};
