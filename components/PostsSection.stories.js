import PostsSectionComponent from './PostsSection'

export default {
    title: "Posts Section",
    component: PostsSectionComponent,
    argTypes: {
        posts: {
            defaultValue: [{
                name: "this-is-an-article-name",
                title: "Some cool article",
                createdAtPretty: "Some time ago",
            }]
        }
    }
}

export const PostsSection = (arg, { argTypes }) => ({
    components: { PostsSectionComponent },
    props: Object.keys(argTypes),
    template: '<PostsSectionComponent :posts="posts" />'
})
