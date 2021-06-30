import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Grid } from "semantic-ui-react";

import PostCard from "../components/PostCard";

function Home() {
    const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS_QUERY);

    return (
        <div>
            <Grid columns={3}>
                <Grid.Row className="page-title">
                    <h1>Recent Posts</h1>
                </Grid.Row>
                <Grid.Row>
                    {loading ? (
                        <h1>Loading Posts...</h1>
                    ) : (
                        posts &&
                        posts?.map(post => (
                            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                                <PostCard post={post} />
                            </Grid.Column>
                        ))
                    )}
                </Grid.Row>
            </Grid>
        </div>
    );
}

const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            createdAt
            username
            likeCount
            body
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                body
                createdAt
            }
        }
    }
`;

export default Home;
