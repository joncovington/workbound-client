import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Message, Transition, List } from 'semantic-ui-react';

import { removeMessage } from './messagesSlice';


const Messages = (props) => {
  const messages = useSelector(state => state.messages)
  const dispatch = useDispatch();

  const dismissMessage = (idx) => {
    dispatch(removeMessage(idx))
  }
  
  
  return (
      <div>
        <Transition.Group
          as={List}
          duration={200}
        >
        {messages.map((item, idx) => {
            let opts = {}
            opts[item.type] = true;
            return (
              <List.Item key={idx}>
                <Message {...opts} header={item.header} content={item.message} onDismiss={() => dismissMessage(idx)}/>
              </List.Item>
            )
        })}
        </Transition.Group>
      </div>
    )

}

export default Messages;