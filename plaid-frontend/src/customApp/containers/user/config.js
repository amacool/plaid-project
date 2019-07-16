const localDataName = 'CM_Users';
const orderStatusOptions = ['Pending', 'Completed', 'Delivered', 'On Hold'];
const columns = [
  {
    title: 'Given Name',
    dataIndex: 'given_name',
    rowKey: 'given_name',
  },
  {
		title: 'Email',
		dataIndex: 'email',
		rowKey: 'email',
	},
	{
		title: 'CreatedOn',
		dataIndex: 'record_created',
		rowKey: 'record_created',
	},
];
export {
	columns,
	localDataName,
	orderStatusOptions,
};
