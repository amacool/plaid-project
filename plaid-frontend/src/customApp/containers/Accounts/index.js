import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '../../../components/uielements/table/index';
import notification from '../../../components/notification/index';
import HelperText from '../../../components/utility/helper-text/index';
import Scrollbars from '../../../components/utility/customScrollBar';
import {Row, FullColumn} from '../../../components/utility/rowColumn';
import LayoutWrapper from '../../../components/utility/layoutWrapper/index';
import Button from '../../../components/uielements/button/index';
import CardWrapper, {
  Table,
  // UserPagination,
} from '../plaid.style';
import {columns} from './config';
import plaidActions from '../../../redux/plaid/actions';
import {bindActionCreators} from "redux";
// import Pagination from '../../../components/uielements/pagination';
import 'rc-pagination/assets/index.css';
import {DemoWrapper} from "../../../components/utility/papersheet";
import Loader from "../../../components/utility/Loader";
import SimpleModal from './simpleModal';
import {CSVLink} from "react-csv";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const { getAccountList } = plaidActions;
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

class Accounts extends Component {
  state = {
    selected: [],
    modalOpen: false,
    selectedUser: null
  };
  
  componentDidMount() {
    const { isAuthenticating, getAccountList, getPlaidPublicToken } = this.props;
    const accessToken = cookies.get('accessToken');
    accessToken && getAccountList(accessToken);
    !accessToken && !isAuthenticating && getPlaidPublicToken();
  }
  
  componentWillReceiveProps(nextProps) {
    const { getAccountList } = this.props;
    const accessToken = cookies.get('accessToken');
    if (nextProps.plaidAccessToken !== this.props.plaidAccessToken) {
      getAccountList(accessToken);
    }
  }

  sendChildCloseModal =(open) => {
    this.setState({modalOpen:open});
    this.setState({selected: []});
  };

  sendChildDeleteEventModal =(open) => {
    const {selected, selectedUser} = this.state;
    if (selected.length === 0) {
      this.props.deleteUser(selectedUser);
      notification('error', '1 User deleted');
      this.setState({selectedUser: null});
    } else {
      const {selected} = this.state;
      notification('error', `${selected.length} users deleted`);
      this.props.deleteUser(selected);
      this.setState({selected: []});
    }
    this.setState({modalOpen: open});
  };

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

  render() {
    let {isLoading, classes, accountList} = this.props;
    // pageNum, itemsPerPage, totalPage
    let csvData = accountList.map(item => {
      let temp = Object.assign({}, item);
      delete temp.balances;
      return temp;
    });
    
    return (
      <LayoutWrapper>
        {
          this.state.modalOpen &&
          <SimpleModal
            eventCloseModal = {this.sendChildCloseModal}
            DeleteEventModal = {this.sendChildDeleteEventModal}
          />
        }
        {
          (isLoading) &&
          <DemoWrapper>
            <Loader/>
          </DemoWrapper>
        }
        <Row>
          <FullColumn>
            <CardWrapper title="Accounts">
              {!accountList || accountList.length === 0 ? (
                <HelperText text=""/>
              ) : (
                <div className={classes.root}>
                  <Scrollbars style={{width: '100%'}}>
                    <Table className={classes.table}>
                      <EnhancedTableHead
                        numSelected={1}
                        onSelectAllClick={this.handleSelectAllClick}
                        rowCount={accountList.length}
                      />
                      <TableBody>
                        {accountList.map((account, index) => {
                          return (
                            <TableRow
                              key={account.account_id}
                              aria-checked={false}
                              selected={false}
                            >
                              {columns.map((column, key) => key < columns.length-1 && (
                                <TableCell
                                  key={`${account.account_id}${column.rowKey}`}
                                >
                                  {column.title === 'No' ? index + 1 : account[column.dataIndex] || ''}
                                </TableCell>
                              ))}
                              <TableCell>
                                <Link to={`/dashboard/accounts/${account.account_id}`}>
                                  <Button
                                    color="primary"
                                    className="mateUserView"
                                  >
                                    Balance
                                  </Button>
                                </Link>
                              </TableCell>
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
                          {/*// this.props.getUserList({pageNum: page, itemsPerPage: itemsPerPage});*/}
                        {/*}}*/}
                      {/*/>*/}
                    {/*</UserPagination>*/}
                    <CSVLink
                      data={csvData}
                      filename={"my-file.csv"}
                      target="_blank"
                      style={{float: 'right', color: '#f82462', marginTop: '20px'}}
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
  accountList: state.Plaid.accountList,
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
      getAccountList: getAccountList,
      getPlaidPublicToken: plaidActions.getPlaidPublicToken
    }, dispatch)
  }
};

const Connect = connect(
  mapStateToProps,
  mapDispatchToProps
)(Accounts);

export default withStyles(styles)(Connect);
