import styled from "styled-components";
import { palette } from "styled-theme";
import Icons from "../../../../components/uielements/icon/index";

const Icon = styled(Icons)``;

const SaleProgress = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .SaleProgressCounter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 25px;

    .currency {
      flex-shrink: 0;
      display: flex;
      align-items: center;

      ${Icon} {
        font-size: 24px;

        &.upward {
          color: ${palette("green", 12)};
        }

        &.downward {
          color: ${palette("red", 5)};
        }
      }

      h3 {
        font-size: 18px;
        font-weight: 500;
        margin: 0 0 0 15px;
        color: ${palette("grey", 8)};
      }
    }

    .progressNumber {
      font-size: 13px;
      font-weight: 500;
      margin: 0;
      color: ${palette("grey", 5)};
    }
  }

  .progressWrapper {
    width: 100%;
    height: 5px;
    display: block;
    position: relative;
    background-color: ${palette("grey", 2)};
    overflow: hidden;
    border-radius: 3px;
    margin-top: 20px;

    span {
      height: 5px;
      background-color: ${palette("indigo", 5)};
      display: block;
      overflow: hidden;
      border-radius: 3px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
`;

export { SaleProgress, Icon };
