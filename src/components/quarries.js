import {gql} from '@apollo/client'

export const USER_DETAILS = gql`
    query findUserByUsername($username: String){
        findUser(username: $username){
            username
            name
            _id
            followers{
                name
                username
                icon
                _id
            }
            following{
                name
                username
                icon
                _id
            }
            messages{
                text
                media
                mediaType
                _id
                date
                sender{
                    username
                    _id
                    name
                    icon
                    verified
                }
                receiver{
                    username
                    _id
                    name
                    icon
                    verified
                }
            }
            posts{
                _id
                text
                from{
                  username
                  name
                  icon
                  verified
                  _id
                }
                date
                media
                mediaType
                comments{
                  _id
                }
                commentTo{
                  from{
                      username
                  }
                }
                likes
            }
            icon
            backImage
            verified
            bio
        }
    }
`

export const SEARCH_USER = gql`
    query searchUserByUsername($username: String!){
        searchUsers(username: $username){
            username
            icon
            name
            verified
            _id
            bio

        }
    }
`

export const DASH_POST = gql`
    query dashPostByUsername($username: String!){
        dashPost(username: $username){
          _id
          text
          from{
            username
            name
            icon
            verified
            _id
          }
          date
          media
          mediaType
          comments{
            _id
          }
          commentTo{
            from{
                username
            }
          }
          likes
        }
    }
`
export const FIND_POST = gql`
query findPostById($id:ID){
    findPost(id:$id){
        _id
        text
        from{
          username
          name
          icon
          verified
          _id
        }
        date
        media
        mediaType
        comments{
            text
            date
            _id
            from{
                username
                name
                icon
                _id
                verified
              }
              media
              mediaType
              likes
        }
        commentTo{
            text
            date
            _id
            from{
                username
                name
                icon
                _id
                verified
              }
              media
              mediaType
              likes
        }
        likes
    }
}
`

export const SIGNUP = gql`
    mutation createUser($username: String!, $name: String!, $password: String!){
        signUp(username: $username, name: $name, password: $password){
         username
         name
         _id
        }
    }
`

export const SIGN_IN = gql`
    mutation logIn($username: String!, $password: String!){
        signIn(username: $username, password: $password){
          value
        }
    }
`
export const CREATE_POST = gql`
    mutation makePost($media: String, $text: String, $followers: [String], $commentTo: ID, $mediaType: String){
        createPost(media: $media, text: $text, followers: $followers, commentTo: $commentTo, mediaType: $mediaType){
            _id
            text
            from{
              username
              name
              icon
              verified
              _id
            }
            date
            media
            mediaType
            comments{
                date
              _id
            }
            commentTo{
              from{
                _id
                username
                name
                icon
              }
            }
            likes
        }
    }
`

export const LIKE= gql`
    mutation likePost($id: ID!){
        like(id: $id){
            _id
            text
            from{
              username
              name
              icon
              verified
              _id
            }
            date
            media
            mediaType
            comments{
                date
              _id
            }
            commentTo{
              from{
                _id
                username
                name
                icon
              }
            }
            likes
    
        }
    }
`


export const FOLLOW = gql`
    mutation followUser($follower:ID!, $following: ID!)
   { follow(follower: $follower, following: $following){
       
        _id
      
    }}
`

export const TEXT = gql`
    mutation messageUser($sender: ID!, $receiver: ID!, $text: String, $mediaType: String, $media: String){
        text(sender: $sender, receiver: $receiver,  text: $text, mediaType: $mediaType, media: $media){
            text
            _id
            date
            mediaType
            sender{
                _id
                username
                name
                icon
                verified
            }

            receiver{
                _id
                username
                name
                icon
                verified
            }
        }
    }
`

export const PROFILE_PIC = gql`
    mutation profilePicture($icon: String, $backImage: String, $bio: String, $name: String){
        profile(icon: $icon, backImage: $backImage, bio: $bio, name: $name){
            name
            bio
            icon
            backImage
        }
    }
`

export const POST_CREATED  = gql`
subscription PostCreated($follow: String){
    newPost(follow: $follow){
        text
        media
        mediaType
        _id
        date
        comments{
            _id
        }
        from{
            username
            name
            icon
            verified
        }
    }
}
`
export const NEW_MESSAGE = gql`
subscription NewMessage($sender: String){
    newMessage(sender: $sender){
        text
        date
        mediaType
        sender{
            username
            name
            verified
            _id
            icon
        }

        receiver{
            username
            name
            verified
            _id
            icon
        }
    }
}
`



