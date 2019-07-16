import React, { Component } from 'react';
import WidgetBox from '../WidgetBox';
import { SaleProgress, Icon } from './style';

export default class SalesProgress extends Component {
  render() {
    const {
      title,
      amount,
      upward,
      downward,
      progress,
      currency,
      color,
      stretched,
    } = this.props;
    const progressFill = {
      width: `${progress}%`,
      backgroundColor: `${color}`,
    };

    return (
      <WidgetBox title={title} stretched={stretched}>
        <SaleProgress>
          <div className="SaleProgressCounter">
            {amount ? (
              <div className="currency">
                {upward || downward ? (
                  upward ? (
                    <Icon className="upward">arrow_upward</Icon>
                  ) : downward ? (
                    <Icon className="downward">arrow_downward</Icon>
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}

                <h3>
                  {currency} {amount}
                </h3>
              </div>
            ) : (
              ''
            )}
            {progress ? (
              <span className="progressNumber">{progress}%</span>
            ) : (
              ''
            )}
          </div>

          {progress ? (
            <div className="progressWrapper">
              <span style={progressFill} />
            </div>
          ) : (
            ''
          )}
        </SaleProgress>
      </WidgetBox>
    );
  }
}
