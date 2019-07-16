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
import Typography from '../../../components/uielements/typography/index';
import notification from '../../../components/notification/index';
import HelperText from '../../../components/utility/helper-text/index';
import Tooltip from '../../../components/uielements/tooltip/index';
import Checkbox from '../../../components/uielements/checkbox/index';
import IconButton from '../../../components/uielements/iconbutton/index';
import Scrollbars from '../../../components/utility/customScrollBar';
import {Row, FullColumn} from '../../../components/utility/rowColumn';
import LayoutWrapper from '../../../components/utility/layoutWrapper/index';
import Button from '../../../components/uielements/button/index';
import CardWrapper, {
  Table,
  DeleteIcon,
  Toolbar, UserPagination,
} from './user.style';
import {columns} from './config';
import userActions from '../../../redux/user/actions';
import {bindActionCreators} from "redux";
import Pagination from '../../../components/uielements/pagination';
import 'rc-pagination/assets/index.css';
import {DemoWrapper} from "../../../components/utility/papersheet";
import Loader from "../../../components/utility/Loader";
import SimpleModal from './simpleModal';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  }
});

const EnhancedTableToolbar = ({numSelected, deleteUser}) => (
  <Toolbar>
    {numSelected > 0 ? (
      <div className="toolbarContent">
        <Typography type="subheading">{numSelected} selected</Typography>
        <Tooltip title="Delete">
          <IconButton aria-label="Delete" onClick={deleteUser}>
            <DeleteIcon>delete</DeleteIcon>
          </IconButton>
        </Tooltip>
      </div>
    ) : (
      ''
    )}
  </Toolbar>
);

const EnhancedTableHead = ({onSelectAllClick, numSelected, rowCount}) => (
  <TableHead>
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          indeterminate={numSelected > 0 && numSelected < rowCount}
          checked={numSelected === rowCount}
          onChange={onSelectAllClick}
          color="primary"
        />
      </TableCell>
      {columns.map(column => (
        <TableCell key={column.rowKey}>{column.title}</TableCell>
      ))}
      <TableCell/>
    </TableRow>
  </TableHead>
);

class Users extends Component {
  state = {
    selected: [],
    modalOpen: false,
    selectedUser: null
  };

  componentDidMount() {
    this.props.getUserList({pageNum: 1, itemsPerPage: 10});
  }

  onModalOpen = () => {
    this.setState({modalOpen:true})
  };

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
    const {selected} = this.state;
    const {isLoading, match, classes, userList, pageNum, itemsPerPage, totalPage, selectCurrentUser} = this.props;

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
          isLoading &&
          <DemoWrapper>
            <Loader/>
          </DemoWrapper>
        }
        <Row>
          <FullColumn>
            <CardWrapper title="Users">
              {!userList || userList.length === 0 ? (
                <HelperText text=""/>
              ) : (
                <div className={classes.root}>
                  <EnhancedTableToolbar
                    numSelected={selected.length}
                    deleteUser={this.onModalOpen}
                  />

                  <Scrollbars style={{width: '100%'}}>
                    <Table className={classes.table}>
                      <EnhancedTableHead
                        numSelected={selected.length}
                        onSelectAllClick={this.handleSelectAllClick}
                        rowCount={userList.length}
                      />
                      <TableBody>
                        {userList.map(user => {
                          const isSelected = this.isSelected(user.id);
                          return (
                            <TableRow
                              key={user.id}
                              aria-checked={isSelected}
                              selected={isSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={isSelected}
                                  onClick={event =>
                                    this.handleCheck(event, user.id)
                                  }
                                  color="primary"
                                />
                              </TableCell>
                              {columns.map(column => (
                                <TableCell
                                  key={`${user.id}${column.rowKey}`}
                                >
                                  {user[column.dataIndex] || ''}
                                </TableCell>
                              ))}
                              <TableCell>
                                <Link to={`${match.path}/${user.id}`}>
                                  <Button
                                    color="primary"
                                    className="mateUserView "
                                    onClick={() => {
                                      selectCurrentUser(user.id);
                                    }}
                                  >
                                    View
                                  </Button>
                                </Link>
                                <IconButton
                                  className="mateInvoiceDlt"
                                  onClick={() => {
                                    this.setState({selectedUser: {id: user.id, userType: user.userType,
                                        email: user.email}});
                                    this.onModalOpen();
                                  }}
                                >
                                  <DeleteIcon>delete</DeleteIcon>
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                    <UserPagination>
                      <Pagination
                        defaultCurrent={pageNum}
                        total={totalPage}
                        onChange={page => {
                          this.props.getUserList({pageNum: page, itemsPerPage: itemsPerPage});
                        }}
                      />
                    </UserPagination>
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
  userList: state.User.userList,
  currentUser: state.User.currentUser,
  pageNum: state.User.pageNum,
  totalPage: state.User.totalPage,
  itemsPerPage: state.User.itemsPerPage,
  isLoading: state.User.isLoading,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ...bindActionCreators({
      getUserList: userActions.getUserList,
      deleteUser: userActions.deleteUser,
      selectCurrentUser: userActions.selectCurrentUser
    }, dispatch)
  }
};

const Connect = connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);

export default withStyles(styles)(Connect);
