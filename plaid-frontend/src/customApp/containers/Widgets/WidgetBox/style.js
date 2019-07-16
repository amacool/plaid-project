import styled from 'styled-components';
import { palette } from 'styled-theme';
import Papersheet from '../../../../components/utility/papersheet';

const WidgetBoxWrapper = styled(Papersheet)`
  width: 100%;
  overflow: hidden;

  @media only screen and (max-width: 768px) {
    min-height: auto !important;
  }

  > div {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  * {
    box-sizing: border-box;
  }

  .widgetTitle,
  .withDescription {
    font-size: 18px;
    font-weight: 400;
    margin: 0 0 15px;
    color: ${palette('grey', 9)};
  }

  .description {
    font-size: 14px;
    font-weight: 400;
    color: ${palette('grey', 5)};
    margin: 0 0 15px;
  }

  .contentWrapper {
    width: 100%;
  }
`;

export { WidgetBoxWrapper };
