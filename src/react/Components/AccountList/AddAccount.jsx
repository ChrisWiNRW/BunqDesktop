import React from "react";
import { connect } from "react-redux";
import {
    ListItem,
    ListItemText
} from "material-ui/List";
import Avatar from "material-ui/Avatar";
import AddBoxIcon from "material-ui-icons/AddBox";

import NavLink from "../../Components/Routing/NavLink";

const styles = {
    bigAvatar: {
        width: 60,
        height: 60
    }
};

class AddAccount extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {

        return (
            <ListItem
                button
                to={`/add-account`}
                component={NavLink}
            >
                <Avatar style={styles.bigAvatar}>
                    <AddBoxIcon/>
                </Avatar>
                <ListItemText
                    secondary='Open a new bank account for yourself or for a group'
                />
            </ListItem>
        );
    }
}

export default connect()(AddAccount);
