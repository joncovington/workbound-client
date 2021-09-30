import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "features/messages/messagesSlice";
import {
  Segment,
  Label,
  Header,
  Icon,
  Dropdown,
  Grid,
  Input,
  Pagination,
} from "semantic-ui-react";
import CategoryList from "features/category/CategoryList";

const Categories = () => {
  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const permissionsFetched = useSelector((state) => state.user.isPermFetched);
  const user = useSelector((state) => state.user);
  const categoryPermissions = user.permissions.category;
  const viewCategoryPemission =
    user.permissions.category?.view_category?.status;

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [categoryCount, setCategoryCount] = useState(0);
  const [displayList, setDisplayList] = useState(false);

  const handlePageSizeChange = (e, { value }) => {
    setPage(1);
    setPageSize(value);
  };

  const handlePaginationChange = (e, { activePage }) => {
    setPage(activePage);
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => setTitleSearch(searchString), 500);
    return () => clearTimeout(timeOutId);
  }, [searchString]);

  const options = [
    { key: 5, text: "5", value: 5 },
    { key: 10, text: "10", value: 10 },
    { key: 20, text: "20", value: 20 },
    { key: 50, text: "50", value: 50 },
  ];

  useEffect(() => {
    if (isSignedIn && permissionsFetched && viewCategoryPemission) {
      setDisplayList(true);
    }
    if (isSignedIn && permissionsFetched && !viewCategoryPemission) {
      dispatch(addMessage("Please contact administrator to upgrade your permissions.", 'negative', 'No Permissions To View Tasks'))
    }
  }, [isSignedIn, viewCategoryPemission, permissionsFetched, dispatch]);

  return (
    <Segment>
      <Header as="h2" icon textAlign="center">
        <Icon name="sitemap" circular />
        <Header.Content>Categories</Header.Content>
      </Header>
      <Segment basic textAlign="center">
        Categories describe an organizational unit such as a 'department' and
        are an attribute of Sections.
      </Segment>
      <Grid>
        <Grid.Row>
          <Grid.Column textAlign="left" width={4}>
            <Label>
              {categoryCount}
              {categoryCount !== 1 ? " Categories" : " Category"}
            </Label>
          </Grid.Column>
          <Grid.Column textAlign="center" width={8}>
            <Input
              fluid
              icon="search"
              placeholder="Search Tasks..."
              onChange={(event) => setSearchString(event.target.value)}
              value={searchString}
            />
          </Grid.Column>
          <Grid.Column textAlign="right" width={4}>
            <Dropdown
              options={options}
              compact
              selection
              onChange={handlePageSizeChange}
              value={pageSize}
            />{" "}
            Per Page
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={4} />
          <Grid.Column textAlign="center" width={8}>
            {categoryCount > 0 && displayList === true ? (
              <Pagination
                size="mini"
                activePage={page}
                totalPages={Math.ceil(categoryCount / pageSize)}
                onPageChange={handlePaginationChange}
                firstItem={{
                  content: <Icon name="angle double left" />,
                  icon: true,
                }}
                lastItem={{
                  content: <Icon name="angle double right" />,
                  icon: true,
                }}
                prevItem={{ content: <Icon name="angle left" />, icon: true }}
                nextItem={{ content: <Icon name="angle right" />, icon: true }}
              />
            ) : null}
          </Grid.Column>
          <Grid.Column width={4}></Grid.Column>
        </Grid.Row>
      </Grid>
      {displayList ? (
        <CategoryList
          user={user}
          page={page}
          setCategoryCount={setCategoryCount}
          pageSize={pageSize}
          titleSearch={titleSearch}
          categoryPermissions={categoryPermissions}
        />
      ) : null}
    </Segment>
  );
};

export default Categories;
