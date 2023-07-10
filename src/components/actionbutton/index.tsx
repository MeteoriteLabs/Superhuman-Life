import React from 'react';
import { Dropdown } from 'react-bootstrap';
import './button.css';

export interface ArrayAction {
    actionClick: () => void;
    actionName: string;
}

const ActionButton: React.FC<{
    status?: string;
    arrayAction: ArrayAction[];
}> = (props) => {
    const { status, arrayAction } = props;

    const renderItemAction = () => {
        return status !== 'accepted' && status !== 'rejected'
            ? arrayAction.map((item, index) => {
                  return (
                      <Dropdown.Item key={index} onClick={item.actionClick}>
                          {item.actionName}
                      </Dropdown.Item>
                  );
              })
            : arrayAction.slice(0, 2).map((item, index) => {
                  return (
                      <Dropdown.Item key={index} onClick={item.actionClick}>
                          {item.actionName}
                      </Dropdown.Item>
                  );
              });
    };

    return (
        <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" as="button" className="dropDown">
                <img src='/assets/cardsKebab.svg'/>
            </Dropdown.Toggle>

            <Dropdown.Menu>{renderItemAction()}</Dropdown.Menu>
        </Dropdown>
    );
};

export default ActionButton;
