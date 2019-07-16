import React, { Component } from 'react';
import { WidgetBoxWrapper } from './style';

export default class WidgetBox extends Component {
  render() {
    const { title, description, children, style, stretched } = this.props;
    return (
      <WidgetBoxWrapper style={style} stretched={stretched}>
        {title ? (
          <h3 className={description ? 'withDescription' : 'widgetTitle'}>
            {title}
          </h3>
        ) : (
          ''
        )}
        {description ? <p className="description">{description}</p> : ''}

        <div className="contentWrapper">{children}</div>
      </WidgetBoxWrapper>
    );
  }
}
