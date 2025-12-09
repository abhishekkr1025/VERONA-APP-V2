// import { trpc } from '@/lib/trpc';
// import { Button } from '@/components/ui/button';
// import { Trash2, Download, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';
// import { formatDistanceToNow } from 'date-fns';

// interface FileGalleryProps {
//   onFileSelect?: (file: { fileName: string; fileUrl: string }) => void;
// }

// export default function FileGallery({ onFileSelect }: FileGalleryProps) {
//   const { data: uploads, isLoading, refetch } = trpc.files.list.useQuery();
//   const deleteMutation = trpc.files.delete.useMutation();

//   const handleDelete = async (uploadId: number) => {
//     if (!confirm('Are you sure you want to delete this file?')) {
//       return;
//     }

//     deleteMutation.mutate(
//       { uploadId },
//       {
//         onSuccess: () => {
//           toast.success('File deleted successfully');
//           refetch();
//         },
//         onError: (error) => {
//           toast.error(error.message || 'Failed to delete file');
//         },
//       }
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
//       </div>
//     );
//   }

//   if (!uploads || uploads.length === 0) {
//     return (
//       <div className="text-center p-8 text-gray-500">
//         <p>No files uploaded yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {uploads.map((upload) => (
//         <div
//           key={upload.id}
//           className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
//         >
//           {/* Image Preview */}
//           {upload.mimeType.startsWith('image/') && (
//             <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
//               <img
//                 src={upload.fileUrl}
//                 alt={upload.fileName}
//                 className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
//                 onClick={() => onFileSelect?.({ fileName: upload.fileName, fileUrl: upload.fileUrl })}
//               />
//             </div>
//           )}

//           {/* File Info */}
//           <div className="p-4">
//             <h3 className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">
//               {upload.fileName}
//             </h3>
//             <p className="text-xs text-gray-500 mt-1">
//               {(upload.fileSize / 1024 / 1024).toFixed(2)} MB
//             </p>
//             <p className="text-xs text-gray-400 mt-1">
//               {formatDistanceToNow(new Date(upload.uploadedAt), { addSuffix: true })}
//             </p>

//             {/* Actions */}
//             <div className="flex gap-2 mt-4">
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="flex-1"
//                 onClick={() => window.open(upload.fileUrl, '_blank')}
//               >
//                 <Download className="w-4 h-4" />
//               </Button>
//               <Button
//                 size="sm"
//                 variant="destructive"
//                 className="flex-1"
//                 onClick={() => handleDelete(upload.id)}
//                 disabled={deleteMutation.isPending}
//               >
//                 {deleteMutation.isPending ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <Trash2 className="w-4 h-4" />
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
