import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '../../../settings/withDirection';
import Icons from '../../../components/uielements/icon/index';
import Textfields from '../../../components/uielements/textfield/index';

const Textfield = styled(Textfields)``;
const PrintIcon = styled(Icons)`
  font-size: 16px;
  margin-right: 6px;
  a {
    text-decoration: none;
  }
`;

const InvoicePageWrapper = styled.div`  
  width: 100%;
  margin :auto;
  .PageHeader {
    width: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-flow: row wrap;
    -ms-flex-flow: row wrap;
    flex-flow: row wrap;
    -webkit-align-items: flex-end;
    -webkit-box-align: flex-end;
    -ms-flex-align: flex-end;
    align-items: flex-end;
    -webkit-box-pack: justify;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: justify;
    justify-content: flex-end;
    margin-bottom: 30px;
    a {
      text-decoration: none;
    }
    .mateInvoPrint {
      background: ${palette('blue', 14)};
      margin-left: 15px;
      @media (max-width: 500px) {
        margin-top: 15px;
      }
    }
    .saveBtn {
      background: ${palette('blue', 14)};
      margin-left: 15px;
    }
  }

  .PageContent {
    .OrderInfo {
      width: 100%;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-flex-flow: row wrap;
      -ms-flex-flow: row wrap;
      flex-flow: row wrap;
      -webkit-align-items: baseline;
      -webkit-box-align: baseline;
      -ms-flex-align: baseline;
      align-items: baseline;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;
      padding-bottom: 0px;
      border-bottom: 1px dashed ${palette('grey', 3)};

      .Title {
        font-size: 16px;
        font-weight: 500;
        color: ${palette('grey', 8)};
        margin: 0 0 20px;
        line-height: 1;
      }

      span.InvoiceNumber {
        font-size: 16px;
        font-weight: 400;
        color: ${palette('blue', 11)};
        margin: 0;
      }

      .RightSideContent {
        display: flex;
        flex-direction: column;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        p {
          font-size: 14px;
          color: ${palette('grey', 8)};
          margin: 0 0 15px;
          font-weight: 500;

          span {
            font-weight: 400;
          }

          &:last-child {
            margin: 0;
          }
        }
        .RightSideStatus {
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 14px;
          color: ${palette('grey', 8)};
          @media (max-width: 500px) {
            margin-left: 12px;
            margin-top: 12px;
          }
          .RightSideStatusSpan {
            margin-left: -10px;
            margin-right: 7px;
          }
          #order-drop-list {
            z-index: 1;
          }
        }
        .RightSideDate {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 5px;
          font-size: 14px;
          color: ${palette('grey', 8)};

          > div {
            margin-left: 25px;
          }
        }
      }
    }

    .LeftSideContent {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-align-items: flex-start;
      -webkit-box-align: flex-start;
      -ms-flex-align: flex-start;
      align-items: flex-start;
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
    }

    .RightSideContent {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-align-items: flex-end;
      -webkit-box-align: flex-end;
      -ms-flex-align: flex-end;
      align-items: flex-start;
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      text-align: right;

      @media only screen and (max-width: 767px) {
        -webkit-align-items: flex-start;
        -webkit-box-align: flex-start;
        -ms-flex-align: flex-start;
        align-items: flex-start;
        text-align: left;
      }

      @media only screen and (min-width: 480px) and (max-width: 767px) {
        -webkit-align-items: flex-end;
        -webkit-box-align: flex-end;
        -ms-flex-align: flex-end;
        align-items: flex-end;
        text-align: right;
      }
      @media only screen and (max-width: 500px) {
        -webkit-align-items: flex-start;
        -webkit-box-align: flex-start;
        -ms-flex-align: flex-start;
        align-items: flex-start;
      }
    }

    .BillingInformation {
      width: 100%;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-flex-flow: row wrap;
      -ms-flex-flow: row wrap;
      flex-flow: row wrap;
      -webkit-align-items: baseline;
      -webkit-box-align: baseline;
      -ms-flex-align: baseline;
      align-items: baseline;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;
      margin-top: 50px;

      .LeftSideContent,
      .RightSideContent {
        width: 50%;

        @media only screen and (max-width: 767px) {
          width: 100%;
        }

        @media only screen and (min-width: 480px) and (max-width: 767px) {
          width: 50%;
        }
      }

      @media only screen and (max-width: 767px) {
        .RightSideContent {
          margin-top: 40px;
        }
      }

      h3.Title,
      .BillFormTitle {
        font-size: 16px;
        font-weight: 500;
        color: ${palette('grey', 9)};
        margin: 0 0 10px;
        line-height: 1;
        label {
          font-size: 19px;
          font-weight: 500;
          color: ${palette('grey', 9)};
          margin: 0 0 10px;
          line-height: 1;
        }
        input {
          font-size: 15px;
          color: ${palette('grey', 7)};
          font-weight: 400;
          display: block;
          margin-top: 10px;
        }
      }
      .BillFormAddress {
        width: 80%;
        textarea {
          height: 100%;
          overflow: hidden;
          font-size: 14px;
          color: ${palette('grey', 7)};
          font-weight: 300;
          font-style: normal;
        }
      }
      p.NameEmail {
        span.Name {
          font-size: 15px;
          color: ${palette('grey', 7)};
          font-weight: 400;
          display: block;
        }

        span.Email {
          font-size: 14px;
          color: ${palette('grey', 7)};
          font-weight: 300;
        }
      }

      address {
        font-size: 14px;
        color: ${palette('grey', 7)};
        font-weight: 300;
        font-style: normal;
      }
    }
    .customScrollBar {
      .scrollbar-thumb {
        &.scrollbar-thumb-y {
          display: none !important;
        }
      }
    }
    .InvoiceTable {
      table {
        thead {
          background-color: ${palette('grey', 2)};
          tr {
            th {
              color: ${palette('grey', 8)};
            }
          }
        }

        tbody {
          tr {
            td {
              color: ${palette('grey', 7)};
              > div {
              }
              input {
                color: ${palette('grey', 7)};
                font-size: 0.8125rem;
              }
              .material-icons {
                color: #757575;
              }
            }
          }
        }
      }
      .InvoiceTableBtn {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        margin-top: 15px;
        .InvoiceEditAddBtn {
          background: ${palette('blue', 14)};
          color: #fff;
        }
      }
      .TotalBill {
        margin-top: 30px;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        width: 100%;
        -webkit-align-items: flex-end;
        -webkit-box-align: flex-end;
        -ms-flex-align: flex-end;
        align-items: flex-end;
        text-align: right;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        padding-left: inherit;

        .TotalBillTitle {
          padding-right: 70px;
        }

        span.emptyBox {
          width: 80px !important;
        }

        p {
          margin-top: 0;
          font-size: 14px;
          color: ${palette('grey', 7)};
          margin-bottom: 15px;
          width: 250px;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: end;
          -webkit-justify-content: flex-end;
          -ms-flex-pack: end;
          justify-content: flex-end;
          text-align: right;

          span {
            width: 120px;
          }
        }

        h3 {
          width: 250px;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: end;
          -webkit-justify-content: flex-end;
          -ms-flex-pack: end;
          justify-content: flex-end;
          text-align: right;
          span {
            width: 120px;
          }
        }
        .totalVat {
          width: 186px;
        }
        .vatRateCalc {
          input {
            color: ${palette('grey', 7)};
            font-size: 14px;
          }
          span {
            width: 120px;
          }
        }
        .currencySign {
          margin-top: -12px;

          input,
          label {
            color: ${palette('grey', 7)};
            font-size: 14px;
          }
        }
        .grandTotal {
          font-size: 18px;
          color: ${palette('grey', 9)};
          margin: 0;
          font-weight: 400;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: end;
          -webkit-justify-content: flex-end;
          -ms-flex-pack: end;
          justify-content: flex-end;
          text-align: right;
          width: 120px;
        }
        .currencySignWithTotal {
          span {
            width: 100%;
          }
          .currencySign {
            margin-left: 10px;
            width: 50px;
          }
          .currencySignSpan {
            width: 120px;
          }
        }
        .currencySignWithTotal {
          display: flex;
          margin-top: 15px;
          > span {
            width: 120px;
          }

          ${Textfield} {
            width: 30px;
            margin-top: -6px;
            margin-left: 10px;
          }
        }
      }
      &.editInvoiceTable {
        table {
          thead {
            background-color: ${palette('grey', 2)};
            tr {
              th {
                color: ${palette('grey', 8)};
              }
            }
          }

          tbody {
            tr {
              td {
                color: ${palette('grey', 7)};
                border-bottom: 0;

                input {
                  color: ${palette('grey', 7)};
                  font-size: 0.8125rem;
                  height: 28px;
                }
                .material-icons {
                  color: #757575;
                }
              }
            }
          }
        }
        .vatRateCalc {
          display: flex;

          ${Textfield} {
            width: 30px;
            margin-top: -12px;
            margin-left: 10px;
          }
        }
        .grandTotal {
          margin-right: 7px;
        }
      }
    }

    .ButtonWrapper {
      width: 100%;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: end;
      -webkit-justify-content: flex-end;
      -ms-flex-pack: end;
      justify-content: flex-end;
      margin-top: 30px;
    }
    .mateInvoPrint {
      background: ${palette('blue', 14)};
      margin-left: 15px;
    }
  }
`;

export { PrintIcon, Textfield };
export default WithDirection(InvoicePageWrapper);
