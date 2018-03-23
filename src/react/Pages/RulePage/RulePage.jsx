import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";

import RuleCreator from "./RuleCreator.tsx";
import RuleCollection from "../../Types/RuleCollection";
import {
    setCategoryRule,
    removeCategoryRule
} from "../../Actions/category_rules";
import { openSnackbar } from "../../Actions/snackbar";
import RuleCollectionPreview from "./RuleCollectionPreview";

const styles = {};

class RulesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            previewRuleCollection: null,
            previewUpdated: new Date()
        };
    }

    updatePreview = ruleCollection => {
        this.setState({
            previewRuleCollection: ruleCollection,
            previewUpdated: new Date()
        });
    };

    render() {
        const { categoryRules, match } = this.props;
        const ruleCollectionId = match.params.ruleId;

        let ruleCollection;
        if (
            ruleCollectionId !== "null" &&
            ruleCollectionId !== null &&
            categoryRules[ruleCollectionId]
        ) {
            ruleCollection = categoryRules[ruleCollectionId];
        } else {
            ruleCollection = new RuleCollection();
        }

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Rule Editor`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <RuleCreator
                        categories={this.props.categories}
                        ruleCollection={ruleCollection}
                        updatePreview={this.updatePreview}
                        openSnackbar={this.props.openSnackbar}
                        saveRuleCollection={this.props.setCategoryRule}
                        removeCategoryCollection={this.props.removeCategoryRule}
                    />
                </Grid>
                <Grid item xs={12}>
                    <RuleCollectionPreview
                        ruleCollection={this.state.previewRuleCollection}
                        ruleCollectionUpdated={this.state.previewUpdated}
                        payments={this.props.payments}
                        bunqMeTabs={this.props.bunqMeTabs}
                        masterCardActions={this.props.masterCardActions}
                        requestInquiries={this.props.requestInquiries}
                        requestResponses={this.props.requestResponses}
                    />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        categories: state.categories.categories,
        categoryRules: state.category_rules.category_rules,

        paymentsLoading: state.payments.loading,
        bunqMeTabsLoading: state.bunq_me_tabs.loading,
        masterCardActionsLoading: state.master_card_actions.loading,
        requestInquiriesLoading: state.request_inquiries.loading,
        requestResponsesLoading: state.request_responses.loading,

        requestResponses: state.request_responses.request_responses,
        payments: state.payments.payments,
        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        masterCardActions: state.master_card_actions.master_card_actions,
        requestInquiries: state.request_inquiries.request_inquiries
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        setCategoryRule: rule_collection =>
            dispatch(setCategoryRule(BunqJSClient, rule_collection)),
        removeCategoryRule: category_rule_id =>
            dispatch(removeCategoryRule(BunqJSClient, category_rule_id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RulesPage);