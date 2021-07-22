import React, { useState, useCallback } from 'react';
import {
    Transition,
    Grid,
    List,
    Icon,
  } from "semantic-ui-react";


const BuilderList = ({ items, setItems}) => {
    const [selection, setSelection] = useState(null);

    const handleSelect = (index) => {
        if (index === selection) {
          setSelection(null);
        } else {
          setSelection(index);
        }
      };
    
      const swapItems = useCallback( (index, direction) => {
        let tempItems = [...items]
        if (direction === 'up') {
          [tempItems[index-1], tempItems[index]] =[tempItems[index], tempItems[index -1]]
        } else {
          [tempItems[index+1], tempItems[index]] =[tempItems[index], tempItems[index+1]]
        }
        setItems(tempItems)
      }, [items, setItems])

    return (
    <Transition visible={items.length !== 0}>
        <Transition.Group
        as={Grid}
        duration={200}
        className='sectionList'
        >
        <Grid.Row columns={3}>
            <Grid.Column width={2} textAlign='center' className='columnHeader'>Move</Grid.Column>
            <Grid.Column width={12} className='columnHeader'>Detail</Grid.Column>
        </Grid.Row>
        {items.map((item, index) => (
            <Grid.Row
            columns={4}
            key={`row_${index}`}
            className={index === selection ? 'sectionItem sectionItemActive' : 'sectionItem'}
            >
            <Grid.Column width={1} style={{paddingRight: '8px'}}>
                {index !== 0 ? (
                    <Icon
                    name="chevron circle up"
                    style={{ display: "inline" }}
                    onClick={() => swapItems(index, 'up')}
                    />
                ) : '\u0020'}
            </Grid.Column>
            <Grid.Column width={1} style={{paddingLeft: '8px'}}>
                {index !== items.length - 1 ? (
                    <Icon
                    
                    name="chevron circle down"
                    style={{ display: "inline" }}
                    onClick={() => swapItems(index, 'down')}
                    />
                ) : '\u0020'}
            </Grid.Column>
            <Grid.Column width={12} style={{cursor: 'pointer'}} >
                <List.Item
                key={`section_${index}`}
                onClick={() => handleSelect(index)}
                >
                <span
                    className={
                    index === selection
                        ? "title active"
                        : null
                    }
                >
                    {item.title}
                </span>
                </List.Item>
            </Grid.Column>
            <Grid.Column width={1} textAlign='right'>
                <Icon name="times circle" color="red" onClick={() => console.log('close')}/>
            </Grid.Column>
            </Grid.Row>
        ))}
        </Transition.Group>
        </Transition>
    )
}

export default BuilderList;