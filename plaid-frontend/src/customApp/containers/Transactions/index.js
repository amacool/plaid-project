import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '../../../components/uielements/table/index';
import HelperText from '../../../components/utility/helper-text/index';
import Scrollbars from '../../../components/utility/customScrollBar';
import {Row, FullColumn} from '../../../components/utility/rowColumn';
import LayoutWrapper from '../../../components/utility/layoutWrapper/index';
import CardWrapper, {
  Table,
  // UserPagination,
} from '../plaid.style';
import {columns} from './config';
import plaidActions from '../../../redux/plaid/actions';
import {bindActionCreators} from "redux";
// import Pagination from '../../../components/uielements/pagination';
// import 'rc-pagination/assets/index.css';
import {DemoWrapper} from "../../../components/utility/papersheet";
import Loader from "../../../components/utility/Loader";
import {CSVLink} from "react-csv";

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  }
});

const EnhancedTableHead = ({onSelectAllClick, numSelected, rowCount}) => (
  <TableHead>
    <TableRow>
      {columns.map(column => (
        <TableCell key={column.rowKey}>{column.title}</TableCell>
      ))}
    </TableRow>
  </TableHead>
);

class Transactions extends Component {
  state = {
    selected: [],
    modalOpen: false,
    selectedUser: null
  };
  
  componentDidMount() {
    this.props.plaidAccessToken && this.props.getTransactionList(this.props.plaidAccessToken.access_token);
  }
  
  componentWillReceiveProps(nextProps) {
    if (!nextProps.plaidAccessToken && nextProps.plaidAccessToken.access_token !== this.props.plaidAccessToken.access_token) {
      this.props.getTransactionList(nextProps.plaidAccessToken.access_token);
    }
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({
        selected: this.props.userList.map(user => user.id),
      });
      return;
    }
    this.setState({selected: []});
  };

  handleCheck = (event, id) => {
    const {selected} = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    this.setState({selected: newSelected});
  };

  render() {
    let {selected} = this.state;
    let {isLoading, classes, transactionList} = this.props;
    // pageNum, itemsPerPage, totalPage
    let csvData = transactionList.map(item => {
      let temp = Object.assign({}, item);
      delete temp.category;
      delete temp.location;
      delete temp.payment_meta;
      return temp;
    });
    
    return (
      <LayoutWrapper>
        {
          (isLoading) &&
          <DemoWrapper>
            <Loader/>
          </DemoWrapper>
        }
        <Row>
          <FullColumn>
            <CardWrapper title="Transactions">
              {!transactionList || transactionList.length === 0 ? (
                <HelperText text=""/>
              ) : (
                <div className={classes.root}>

                  <Scrollbars style={{width: '100%'}}>
                    <Table className={classes.table}>
                      <EnhancedTableHead
                        numSelected={selected.length}
                        onSelectAllClick={this.handleSelectAllClick}
                        rowCount={transactionList.length}
                      />
                      <TableBody>
                        {transactionList.map((transaction, index) => {
                          const isSelected = this.isSelected(transaction.category_id);
                          return (
                            <TableRow
                              key={`${transaction.category_id}${index}`}
                              aria-checked={isSelected}
                              selected={isSelected}
                            >
                              {columns.map(column => (
                                <TableCell
                                  key={`${transaction.category_id}${column.rowKey}`}
                                >
                                  {column.title === 'No' ? index + 1 :
                                  column.title === 'Pending' ? (transaction[column.dataIndex] ? 'YES' : 'NO') :
                                  transaction[column.dataIndex] || ''}
                                </TableCell>
                              ))}
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                    {/*<UserPagination>*/}
                      {/*<Pagination*/}
                        {/*defaultCurrent={pageNum}*/}
                        {/*total={totalPage}*/}
                        {/*onChange={page => {*/}
                          {/*this.props.getUserList({pageNum: page, itemsPerPage: itemsPerPage});*/}
                        {/*}}*/}
                      {/*/>*/}
                    {/*</UserPagination>*/}
                    <CSVLink
                      data={csvData}
                      filename={"my-file.csv"}
                      target="_blank"
                      style={{float: 'right', color: 'red', marginTop: '20px'}}
                    >
                      Download
                    </CSVLink>
                  </Scrollbars>
                </div>
              )}
            </CardWrapper>
          </FullColumn>
        </Row>

      </LayoutWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  transactionList: state.Plaid.transactionList,
  accessToken: state.Plaid.accessToken,
  isLoading: state.Plaid.isLoading,
  isAuthenticating: state.Plaid.isAuthenticating,
  plaidAccessToken: state.Plaid.plaidAccessToken,
  currentUser: state.User.currentUser,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ...bindActionCreators({
      getTransactionList: plaidActions.getTransactionList
    }, dispatch)
  }
};

const Connect = connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions);

export default withStyles(styles)(Connect);
