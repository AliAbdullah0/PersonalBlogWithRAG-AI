import Link from "next/link"

const PostCard = ({id, title, content, image, reference, author, createdAt}: {
  id: string,
  title: string,
  content: string,
  image?: string,
  reference?: string,
  author: string,
  createdAt: Date
}) => {
  return (
    <article className="relative overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg">
      {image ? (
        <img
          alt={title}
          src={image}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 h-full w-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            No image available
          </span>
        </div>
      )}

      <div className="relative bg-gradient-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
        <div className="p-4 sm:p-6">
          <time 
            dateTime={createdAt?.toISOString()} 
            className="block text-xs text-white/90"
          >
            {createdAt 
              ? new Date(createdAt).toLocaleDateString()
              : "Date not available"
            }
          </time>

          <Link href={`/post/${id}`}>
            <h3 className="mt-0.5 text-lg text-white">
              {title}
            </h3>
          </Link>

          <p className="mt-2 line-clamp-3 text-sm/relaxed text-white/95">
            {content}
          </p>
        </div>
      </div>
    </article>
  )
}

export default PostCard