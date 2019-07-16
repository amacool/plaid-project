import React from "react";
import {
  SimpleCards,
  CardContents,
  CardAction,
  Typography
} from "../../../containers/UiElements/Cards/card.style";
import Button from "../../../components/uielements/button";

function CustomSimpleCard(props) {
  const { account } = props;
  
  return (
    <div>
      <SimpleCards>
        <CardContents>
          <Typography type="body1" className="title">
            Account Id
          </Typography>
          
          <Typography type="caption" component="h2">
            Account Id
          </Typography>
          <Typography type="body1" className="pos">
            {account.account_id}
          </Typography>
  
          <Typography type="caption" component="h2">
            Name
          </Typography>
          <Typography type="body1" className="pos">
            {account.name}
          </Typography>
          
          <Typography type="caption" component="h2">
            Mask
          </Typography>
          <Typography type="body1" className="pos">
            {account.mask}
          </Typography>
  
          <Typography type="caption" component="h2">
            Official Name
          </Typography>
          <Typography type="body1" className="pos">
            {account.official_name}
          </Typography>
  
          <Typography type="caption" component="h2">
            Subtype
          </Typography>
          <Typography type="body1" className="pos">
            {account.subtype}
          </Typography>
  
          <Typography type="caption" component="h2">
            Type
          </Typography>
          <Typography type="body1" className="pos">
            {account.type}
          </Typography>
        </CardContents>
        <CardAction>
          <Button size="small">Learn More</Button>
        </CardAction>
      </SimpleCards>
    </div>
  );
}

export default CustomSimpleCard;
