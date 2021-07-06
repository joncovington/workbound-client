import React from 'react';
import { Accordion, List} from 'semantic-ui-react';


const PermissionList = (props) => {
    const permissions = props.user.permissions;
    const panels = []
    Object.keys(permissions).forEach((perm, index) =>{
        if(Object.keys(permissions[perm]).length > 0) {
            panels.push({
                key: `panel-${index}`,
                title: {
                    content: perm.toUpperCase()
                },
                content: {
                    content: <List bulleted items={Object.values(permissions[perm])} />
                }
    
            })
        }
    })
    return (
        <Accordion defaultActiveIndex={0} panels={panels} styled fluid/>
    );
};

export default PermissionList;