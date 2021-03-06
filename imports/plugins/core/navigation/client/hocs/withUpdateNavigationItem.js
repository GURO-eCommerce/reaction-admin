import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Mutation, withApollo } from "react-apollo";
import { navigationItemFragment, navigationTreeWith10LevelsFragment } from "./fragments";

const updateNavigationItemMutation = gql`
  mutation updateNavigationItemMutation($input: UpdateNavigationItemInput!) {
    updateNavigationItem(input: $input) {
      navigationItem {
        ...NavigationItem
      }
    }
  }
  ${navigationItemFragment}
`;

const deleteNavigationItemMutation = gql`
  mutation deleteNavigationItemMutation($input: DeleteNavigationItemInput!) {
    deleteNavigationItem(input: $input) {
      navigationItem {
        ...NavigationItem
      }
    }
  }
  ${navigationItemFragment}
`;

const publishNavigationChangesMutation = gql`
  mutation publishNavigationChangesMutation($input: PublishNavigationChangesInput!) {
    publishNavigationChanges(input: $input) {
      navigationTree {
        ...NavigationTreeWith10Levels
      }
    }
  }
  ${navigationTreeWith10LevelsFragment}
`;

export default (Component) => {
  class WithUpdateNavigationItem extends React.Component {
    static propTypes = {
      client: PropTypes.object,
      defaultNavigationTreeId: PropTypes.string,
      onDeleteNavigationItem: PropTypes.func,
      onUpdateNavigationItem: PropTypes.func,
      refetchNavigationTree: PropTypes.func,
      shopId: PropTypes.string
    }

    static defaultProps = {
      onDeleteNavigationItem() {},
      onUpdateNavigationItem() {}
    }

    handleUpdateNavigationItem = (data) => {
      const { updateNavigationItem: { navigationItem } } = data;
      this.props.onUpdateNavigationItem(navigationItem);
      this.handlePublishNavigationChanges();
    }

    handleDeleteNavigationItem = (data) => {
      const { deleteNavigationItem: { navigationItem } } = data;
      this.props.onDeleteNavigationItem(navigationItem);
      this.props.refetchNavigationTree();
      this.handlePublishNavigationChanges();
    }

    handlePublishNavigationChanges = () => {
      const { client, defaultNavigationTreeId, shopId } = this.props;

      client.mutate({
        mutation: publishNavigationChangesMutation,
        variables: {
          input: {
            id: defaultNavigationTreeId,
            shopId
          }
        }
      });
    }

    render() {
      return (
        <Mutation mutation={updateNavigationItemMutation} onCompleted={this.handleUpdateNavigationItem} >
          {(updateNavigationItem) => (
            <Mutation mutation={deleteNavigationItemMutation} onCompleted={this.handleDeleteNavigationItem} >
              {(deleteNavigationItem) => (
                <Component
                  {...this.props}
                  deleteNavigationItem={deleteNavigationItem}
                  updateNavigationItem={updateNavigationItem}
                  publishNavigationChanges={this.handlePublishNavigationChanges}
                />
              )}
            </Mutation>
          )}
        </Mutation>
      );
    }
  }

  return withApollo(WithUpdateNavigationItem);
};
