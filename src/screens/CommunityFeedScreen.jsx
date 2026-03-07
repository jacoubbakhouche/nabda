import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Users } from 'lucide-react';
import { usePregnancy } from '../context/PregnancyContext';

export default function CommunityFeedScreen() {
    const { getPosts, addPost, getPostLikes, togglePostLike, getPostComments, addPostComment } = usePregnancy();
    const [stories, setStories] = useState([]);
    const [newStoryText, setNewStoryText] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        loadStories();
    }, []);

    const loadStories = async () => {
        const data = await getPosts();
        setStories(data);
    };

    const handlePostStory = async () => {
        if (!newStoryText.trim()) return;
        setIsPosting(true);
        await addPost(newStoryText);
        setNewStoryText('');
        await loadStories();
        setIsPosting(false);
    };

    return (
        <div className="community-container flex-col" style={{ gap: '2px' }}>
            <div className="sticky-post-container">
                <div className="flex-row align-center" style={{ gap: '12px', marginBottom: '16px' }}>
                    <h2 className="section-title">مجتمع الأمهات</h2>
                </div>

                <div className="add-story-card">
                    <div className="flex-row align-center" style={{ gap: '8px', marginBottom: '12px' }}>
                        <div className="icon-circle-purple">
                            <Users size={18} color="var(--token-purple-pill)" />
                        </div>
                        <span className="card-subtitle">شاركي تجربتكِ واسألي الأمهات</span>
                    </div>
                    <textarea
                        placeholder="اكتبي مشاعركِ، سؤالكِ أو نصيحة للأمهات..."
                        value={newStoryText}
                        onChange={(e) => setNewStoryText(e.target.value)}
                    />
                    <div className="flex-row justify-end">
                        <button
                            className="post-btn"
                            onClick={handlePostStory}
                            disabled={isPosting}
                        >
                            {isPosting ? 'جاري النشر...' : 'نشر التجربة'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="stories-list flex-col" style={{ gap: '16px', paddingBottom: '100px', marginTop: '16px' }}>
                {stories.map((story) => (
                    <StoryCard
                        key={story.id}
                        story={story}
                        getPostLikes={getPostLikes}
                        togglePostLike={togglePostLike}
                        getPostComments={getPostComments}
                        addPostComment={addPostComment}
                    />
                ))}
            </div>

            <style>{`
                .sticky-post-container {
                    position: sticky;
                    top: -16px;
                    z-index: 100;
                    background-color: #F9FAFB; /* Match app background */
                    padding: 16px 20px 8px 20px;
                    margin: 0 -20px; /* Counteract parent padding to stretch full width */
                }
                .section-title { font-size: 24px; font-weight: 600; line-height: 1.2; color: #1C1C1E; }
                
                /* Story Cards */
                .add-story-card {
                    background: #FFF; padding: 16px; border-radius: 20px;
                    border: 1px solid var(--border-light);
                    box-shadow: 0 4px 20px rgba(168, 85, 247, 0.05);
                }
                .icon-circle-purple {
                    width: 32px; height: 32px; border-radius: 10px;
                    background: var(--token-purple-light);
                    display: flex; justify-content: center; align-items: center;
                }
                .card-subtitle { font-size: 14px; font-weight: 700; color: #1C1C1E; }
                .add-story-card textarea {
                    border: 1px solid #F3F4F6; outline: none; resize: none; min-height: 56px; 
                    font-size: 14px; background: #FAFAFA; padding: 12px 16px; border-radius: 16px;
                    width: 100%; transition: all 0.3s; margin-bottom: 12px; font-family: inherit;
                }
                .add-story-card textarea:focus { border-color: var(--token-purple-pill); background: #FFF; }
                .post-btn {
                    background: linear-gradient(135deg, #A855F7 0%, #7E22CE 100%);
                    color: #FFF; border: none; padding: 12px 24px; border-radius: 14px;
                    font-weight: 700; cursor: pointer; transition: transform 0.2s;
                    box-shadow: 0 4px 12px rgba(126, 34, 206, 0.2); font-family: inherit;
                }
                .post-btn:active { transform: scale(0.96); }
                .post-btn:disabled { opacity: 0.6; pointer-events: none; }
                .story-card {
                    background: #FFF; padding: 20px; border-radius: 24px;
                    border: 1px solid var(--border-light); display: flex; flex-direction: column; gap: 12px;
                }
                .story-footer {
                    display: flex; gap: 16px; margin-top: 8px; border-top: 1px solid #F3F4F6; padding-top: 12px;
                }
                .action-btn {
                    display: flex; align-items: center; gap: 6px; background: none; border: none;
                    font-size: 13px; font-weight: 600; color: #666; cursor: pointer; padding: 4px 8px;
                    border-radius: 8px; transition: all 0.2s; font-family: inherit;
                }
                .action-btn:hover { background: #F9FAFB; }
                .action-btn.liked { color: var(--token-purple-pill); }
                .avatar-small {
                    width: 32px; height: 32px; border-radius: 50%; background: #F3E8FF;
                    display: flex; justify-content: center; align-items: center;
                    font-weight: 700; color: var(--token-purple-pill); font-size: 14px;
                }
                .author-name { font-weight: 700; font-size: 14px; }
                .story-text { font-size: 14px; line-height: 1.6; color: #333; }
                .story-time { font-size: 11px; color: #999; }

                /* Comments Section */
                .comments-section {
                    margin-top: 12px; display: flex; flex-direction: column; gap: 10px;
                    padding: 12px; background: #F9FAFB; border-radius: 16px;
                }
                .comment-item { display: flex; flex-direction: column; gap: 4px; }
                .comment-author { font-size: 12px; font-weight: 700; color: var(--token-purple-pill); }
                .comment-text { font-size: 13px; color: #444; line-height: 1.4; }
                
                .comment-input-wrapper {
                    display: flex; align-items: center; gap: 8px; margin-top: 8px;
                    background: #FFF; padding: 8px 12px; border-radius: 12px;
                    border: 1px solid var(--border-light);
                }
                .comment-input-wrapper input {
                    flex: 1; border: none; outline: none; font-size: 13px; font-family: inherit;
                }
                .send-comment-btn {
                    background: var(--token-purple-pill); color: #FFF; border: none;
                    width: 28px; height: 28px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center; cursor: pointer;
                }
            `}</style>
        </div>
    );
}

function StoryCard({ story, getPostLikes, togglePostLike, getPostComments, addPostComment }) {
    const [likes, setLikes] = useState({ count: 0, isLiked: false });
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const likesData = await getPostLikes(story.id);
            setLikes(likesData);
            setIsLoading(false);
        };
        loadData();
    }, [story.id, getPostLikes]);

    const handleToggleLike = async () => {
        const newIsLiked = !likes.isLiked;
        setLikes(prev => ({
            count: newIsLiked ? prev.count + 1 : prev.count - 1,
            isLiked: newIsLiked
        }));
        await togglePostLike(story.id, likes.isLiked);
    };

    const handleToggleComments = async () => {
        if (!showComments) {
            const data = await getPostComments(story.id);
            setComments(data);
        }
        setShowComments(!showComments);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        const textToSubmit = newComment;
        setNewComment('');

        // Optimistic update
        const tempId = Math.random().toString();
        setComments(prev => [...prev, { id: tempId, author: 'أنتِ', text: textToSubmit, time: 'الآن' }]);

        await addPostComment(story.id, textToSubmit);
        const refreshed = await getPostComments(story.id);
        setComments(refreshed);
    };

    return (
        <div className="story-card">
            <div className="flex-row align-center" style={{ gap: '10px', marginBottom: '8px' }}>
                <div className="avatar-small">{story.author[0]}</div>
                <span className="author-name">{story.author}</span>
            </div>
            <p className="story-text">{story.text}</p>
            <div className="flex-row justify-between align-center">
                <span className="story-time">{story.time}</span>
            </div>

            <div className="story-footer">
                <button
                    className={`action-btn ${likes.isLiked ? 'liked' : ''}`}
                    onClick={handleToggleLike}
                >
                    <Heart size={18} fill={likes.isLiked ? "var(--token-purple-pill)" : "none"} color={likes.isLiked ? "var(--token-purple-pill)" : "#666"} />
                    <span>{likes.count} أعجبني</span>
                </button>
                <button className="action-btn" onClick={handleToggleComments}>
                    <MessageCircle size={18} />
                    <span>{showComments ? 'إخفاء التعليقات' : 'التعليقات'}</span>
                </button>
            </div>

            {showComments && (
                <div className="comments-section tab-content-fade-in">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <span className="comment-author">{comment.author}</span>
                            <span className="comment-text">{comment.text}</span>
                        </div>
                    ))}
                    <div className="comment-input-wrapper">
                        <input
                            type="text"
                            placeholder="أضيفي تعليقاً..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button className="send-comment-btn" onClick={handleAddComment}>
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
