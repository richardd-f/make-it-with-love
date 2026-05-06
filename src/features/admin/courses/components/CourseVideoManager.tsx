'use client';

import { useState, useActionState, useEffect } from 'react';
import { UploadButton } from '@/src/components/UploadButton';
import { addVideoToCourse, deleteVideoFromCourse, updateVideoInCourse } from '../actions/videoActions';
import { Video } from '@/src/generated/prisma/client';

type CourseVideoManagerProps = {
  courseId: string;
  videos: Video[];
};

export function CourseVideoManager({ courseId, videos }: CourseVideoManagerProps) {
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  
  const [addResult, addFormAction, isAddPending] = useActionState(addVideoToCourse as any, undefined);
  const [updateResult, updateFormAction, isUpdatePending] = useActionState(updateVideoInCourse as any, undefined);
  
  const isPending = isAddPending || isUpdatePending;
  const resultMessage = (editingVideo ? updateResult : addResult) as { error?: string; success?: string } | undefined;

  // Sync uploadedUrl when editingVideo changes
  useEffect(() => {
    if (editingVideo) {
      setUploadedUrl(editingVideo.url);
    } else {
      setUploadedUrl(null);
    }
  }, [editingVideo]);

  // Reset state on success
  useEffect(() => {
    if ((updateResult as any)?.success || (addResult as any)?.success) {
      setEditingVideo(null);
      setUploadedUrl(null);
    }
  }, [updateResult, addResult]);

  const handleDelete = async (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await deleteVideoFromCourse(videoId, courseId);
      if (editingVideo?.id === videoId) {
        setEditingVideo(null);
      }
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50 mt-8">
      <h2 className="text-3xl font-family-papernotes text-[var(--color-orange)]">Course Videos</h2>
      
      {/* List Existing Videos */}
      {videos.length > 0 ? (
        <div className="flex flex-col gap-3 mb-4">
          {videos.map(video => (
            <div key={video.id} className="flex justify-between items-center bg-white/70 p-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col flex-1 mr-4">
                <span className="font-bold font-sans text-gray-800">{video.title}</span>
                <span className="text-sm text-gray-500 line-clamp-1">{video.description}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPreviewVideoUrl(video.url)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors flex items-center justify-center"
                  title="Preview Video"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
                <button 
                  onClick={() => handleEdit(video)}
                  className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full transition-colors flex items-center justify-center"
                  title="Edit Video"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(video.id)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors flex items-center justify-center"
                  title="Delete Video"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic mb-4">No videos added yet.</p>
      )}

      {/* Add / Edit Video Form */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold font-sans text-gray-700">
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h3>
          {editingVideo && (
            <button 
              onClick={handleCancelEdit}
              className="text-sm font-bold text-gray-500 hover:text-gray-700 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
        
        <form action={(formData) => {
          if (editingVideo) {
            (updateFormAction as any)(formData);
          } else {
            (addFormAction as any)(formData);
          }
        }} className="flex flex-col gap-4">
          <input type="hidden" name="courseId" value={courseId} />
          {editingVideo && <input type="hidden" name="videoId" value={editingVideo.id} />}
          <input type="hidden" name="url" value={uploadedUrl || ''} />

          <div className="flex flex-col gap-1">
            <label className="font-sans font-semibold text-foreground/80 ml-2 text-sm" htmlFor="title">Video Title</label>
            <input 
              key={editingVideo ? `title-${editingVideo.id}` : 'title-new'}
              className="w-full px-4 py-2 rounded-xl bg-white/70 border-2 border-[var(--color-orange)]/30 focus:border-[var(--color-orange)] outline-none" 
              id="title" name="title" type="text" required
              defaultValue={editingVideo?.title || ''}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-sans font-semibold text-foreground/80 ml-2 text-sm" htmlFor="description">Description</label>
            <textarea 
              key={editingVideo ? `desc-${editingVideo.id}` : 'desc-new'}
              className="w-full px-4 py-2 rounded-xl bg-white/70 border-2 border-[var(--color-orange)]/30 focus:border-[var(--color-orange)] outline-none min-h-[80px]" 
              id="description" name="description"
              defaultValue={editingVideo?.description || ''}
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <span className="font-sans font-semibold text-foreground/80 ml-2 text-sm">Video File</span>
            <UploadButton 
              onSuccess={(url) => setUploadedUrl(url)}
              options={{ resourceType: 'video' }} // Restrict to video
            >
              {({ open, isLoading }) => (
                <button
                  type="button"
                  onClick={open}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-[#f6e5c4] hover:bg-[#f79d1c] text-[#e4552c] hover:text-white border-2 border-dashed border-[#e4552c]/50 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Loading...' : (uploadedUrl ? 'Video Uploaded! Click to Change' : 'Upload Video to Cloudinary')}
                </button>
              )}
            </UploadButton>
          </div>

          {resultMessage?.error && (
            <div className="text-[var(--color-red)] bg-[var(--color-red)]/10 px-4 py-3 rounded-xl mt-2">
              <p className="text-sm font-medium">{resultMessage.error}</p>
            </div>
          )}
          
          {resultMessage?.success && (
            <div className="text-[var(--color-green)] bg-[var(--color-green)]/10 px-4 py-3 rounded-xl mt-2">
              <p className="text-sm font-medium">{resultMessage.success}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending || !uploadedUrl}
            className="mt-4 w-full py-4 bg-[var(--color-orange)] hover:bg-[var(--color-red)] text-white font-bold text-xl rounded-full transition-all shadow-md font-family-papernotes tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving...' : (editingVideo ? 'Update Video' : 'Save Video')}
          </button>
        </form>
      </div>

      {/* Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl shadow-2xl overflow-hidden">
            <button 
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <video 
              src={previewVideoUrl} 
              controls 
              autoPlay 
              className="w-full h-auto max-h-[80vh] outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
