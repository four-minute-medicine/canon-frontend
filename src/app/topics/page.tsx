'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiPlus, FiTrash2, FiChevronDown, FiChevronRight, FiX, FiCheck, FiEdit2, FiEye } from 'react-icons/fi'
import { IoAlertCircleOutline } from 'react-icons/io5'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

interface SourceInfo {
    source: string
    min_page: number
    max_page: number
    page_count: number
}

interface Topic {
    id: number
    topic_name: string
    topic_description: string
    source: string
    start_page: number
    end_page: number
    namespace: string
    created_at: string
}

interface ChunkPreview {
    id: number
    page: number
    section: string
    chunk_index: number
    content_preview: string
}

export default function TopicsPage() {
    const router = useRouter()

    const [topics, setTopics] = useState<Topic[]>([])
    const [sources, setSources] = useState<SourceInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Create topic form
    const [selectedSource, setSelectedSource] = useState('')
    const [startPage, setStartPage] = useState<number | ''>('')
    const [endPage, setEndPage] = useState<number | ''>('')
    const [topicName, setTopicName] = useState('')
    const [topicDesc, setTopicDesc] = useState('')
    const [creating, setCreating] = useState(false)

    // Preview
    const [previewChunks, setPreviewChunks] = useState<ChunkPreview[]>([])
    const [previewing, setPreviewing] = useState(false)

    // Expand topic
    const [expandedTopicId, setExpandedTopicId] = useState<number | null>(null)
    const [topicChunks, setTopicChunks] = useState<Record<number, ChunkPreview[]>>({})
    const [loadingChunks, setLoadingChunks] = useState<number | null>(null)

    // Inline edit
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editName, setEditName] = useState('')
    const [editDesc, setEditDesc] = useState('')
    const [editStart, setEditStart] = useState<number | ''>('')
    const [editEnd, setEditEnd] = useState<number | ''>('')

    const fetchTopics = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/topics`)
            if (!res.ok) throw new Error(`Failed to fetch topics: ${res.status}`)
            setTopics(await res.json())
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load topics')
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchSources = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/topics/sources`)
            if (!res.ok) throw new Error(`Failed to fetch sources: ${res.status}`)
            setSources(await res.json())
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load sources')
        }
    }, [])

    useEffect(() => { fetchTopics(); fetchSources() }, [fetchTopics, fetchSources])

    const handlePreview = async () => {
        if (!selectedSource || startPage === '' || endPage === '') return
        setPreviewing(true)
        setPreviewChunks([])
        try {
            const res = await fetch(
                `${API_BASE_URL}/topics/preview-chunks?source=${encodeURIComponent(selectedSource)}&start_page=${startPage}&end_page=${endPage}`
            )
            if (!res.ok) throw new Error(`Preview failed: ${res.status}`)
            const data = await res.json()
            setPreviewChunks(data.chunks || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Preview failed')
        } finally {
            setPreviewing(false)
        }
    }

    const handleCreate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!topicName.trim() || !selectedSource || startPage === '' || endPage === '') return
        setCreating(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE_URL}/topics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic_name: topicName.trim(),
                    topic_description: topicDesc.trim(),
                    source: selectedSource,
                    start_page: startPage,
                    end_page: endPage,
                }),
            })
            if (!res.ok) throw new Error(`Failed to create topic: ${res.status}`)
            setTopicName('')
            setTopicDesc('')
            setSelectedSource('')
            setStartPage('')
            setEndPage('')
            setPreviewChunks([])
            setSuccess('Topic created successfully')
            await fetchTopics()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create topic')
        } finally {
            setCreating(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this topic?')) return
        try {
            const res = await fetch(`${API_BASE_URL}/topics/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
            setSuccess('Topic deleted')
            if (expandedTopicId === id) setExpandedTopicId(null)
            await fetchTopics()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed')
        }
    }

    const handleUpdate = async (id: number) => {
        try {
            const body: Record<string, string | number> = {}
            if (editName.trim()) body.topic_name = editName.trim()
            body.topic_description = editDesc.trim()
            if (editStart !== '') body.start_page = editStart
            if (editEnd !== '') body.end_page = editEnd
            const res = await fetch(`${API_BASE_URL}/topics/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            if (!res.ok) throw new Error(`Update failed: ${res.status}`)
            setEditingId(null)
            setSuccess('Topic updated')
            await fetchTopics()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed')
        }
    }

    const expandTopic = async (id: number) => {
        if (expandedTopicId === id) { setExpandedTopicId(null); return }
        setExpandedTopicId(id)
        setLoadingChunks(id)
        try {
            const res = await fetch(`${API_BASE_URL}/topics/${id}/chunks`)
            if (!res.ok) throw new Error(`Failed to load chunks: ${res.status}`)
            const data = await res.json()
            setTopicChunks(prev => ({ ...prev, [id]: data.chunks || [] }))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load chunks')
        } finally {
            setLoadingChunks(null)
        }
    }

    const currentSource = sources.find(s => s.source === selectedSource)

    return (
        <div className="min-h-screen bg-[#F7F7F7]">
            <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors text-sm">
                        <FiArrowLeft className="w-4 h-4" /> Back to Chat
                    </button>
                    <h1 className="text-xl font-semibold text-black">Topic Management</h1>
                    <div className="w-24" />
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                        <FiCheck className="w-5 h-5 text-green-600 shrink-0" />
                        <p className="text-sm text-green-800 flex-1">{success}</p>
                        <button onClick={() => setSuccess(null)}><FiX className="w-4 h-4 text-green-600" /></button>
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                        <IoAlertCircleOutline className="w-5 h-5 text-red-500 shrink-0" />
                        <p className="text-sm text-red-700 flex-1">{error}</p>
                        <button onClick={() => setError(null)}><FiX className="w-4 h-4 text-red-500" /></button>
                    </div>
                )}

                {/* ── Create topic ── */}
                <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-base font-semibold text-black mb-4">Create Topic</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        {/* Step 1: Source */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700">Source Document <span className="text-red-500">*</span></label>
                            <select
                                value={selectedSource}
                                onChange={e => { setSelectedSource(e.target.value); setPreviewChunks([]) }}
                                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Select a source document...</option>
                                {sources.map(s => (
                                    <option key={s.source} value={s.source}>
                                        {s.source} (pages {s.min_page}–{s.max_page}, {s.page_count} pages)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Step 2: Page range */}
                        {selectedSource && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">Start Page <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={startPage}
                                        onChange={e => setStartPage(e.target.value ? parseInt(e.target.value) : '')}
                                        min={currentSource?.min_page}
                                        max={currentSource?.max_page}
                                        placeholder={String(currentSource?.min_page || 1)}
                                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">End Page <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        value={endPage}
                                        onChange={e => setEndPage(e.target.value ? parseInt(e.target.value) : '')}
                                        min={startPage || currentSource?.min_page}
                                        max={currentSource?.max_page}
                                        placeholder={String(currentSource?.max_page || 999)}
                                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                                    />
                                </div>
                                <div className="flex items-end col-span-2 md:col-span-2">
                                    <button
                                        type="button"
                                        onClick={handlePreview}
                                        disabled={previewing || startPage === '' || endPage === ''}
                                        className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {previewing ? (
                                            <span className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                                        ) : (
                                            <FiEye className="w-4 h-4" />
                                        )}
                                        Preview Chunks
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Preview results */}
                        {previewChunks.length > 0 && (
                            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">{previewChunks.length} chunk(s) in this range:</p>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {previewChunks.map(c => (
                                        <div key={c.id} className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-gray-400">#{c.id}</span>
                                                <span className="text-xs text-gray-500">p{c.page}</span>
                                                {c.section && <span className="text-xs text-gray-400 truncate max-w-[250px]">{c.section}</span>}
                                            </div>
                                            <p className="text-xs text-gray-600 leading-relaxed">{c.content_preview}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Topic name */}
                        {selectedSource && startPage !== '' && endPage !== '' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">Topic Name <span className="text-red-500">*</span></label>
                                    <input
                                        value={topicName}
                                        onChange={e => setTopicName(e.target.value)}
                                        placeholder="e.g. Sickle Cell Disease"
                                        required
                                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <input
                                        value={topicDesc}
                                        onChange={e => setTopicDesc(e.target.value)}
                                        placeholder="Brief description (optional)"
                                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        {selectedSource && startPage !== '' && endPage !== '' && (
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={creating || !topicName.trim()}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#1e1e1e] hover:bg-[#2d2d2d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-full transition-colors"
                                >
                                    {creating ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <FiPlus className="w-4 h-4" />
                                    )}
                                    Create Topic
                                </button>
                            </div>
                        )}
                    </form>
                </section>

                {/* ── Topic list ── */}
                <section className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-base font-semibold text-black mb-4">
                        Topics {!loading && <span className="text-gray-400 font-normal">({topics.length})</span>}
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <span className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        </div>
                    ) : topics.length === 0 ? (
                        <p className="text-sm text-gray-500 py-8 text-center">No topics yet. Create one above.</p>
                    ) : (
                        <div className="space-y-3">
                            {topics.map(topic => (
                                <div key={topic.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                        <button onClick={() => expandTopic(topic.id)} className="flex items-center gap-3 flex-1 text-left min-w-0">
                                            {expandedTopicId === topic.id
                                                ? <FiChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                                                : <FiChevronRight className="w-4 h-4 text-gray-500 shrink-0" />}

                                            {editingId === topic.id ? (
                                                <div className="flex items-center gap-2 flex-1" onClick={e => e.stopPropagation()}>
                                                    <input value={editName} onChange={e => setEditName(e.target.value)}
                                                        className="px-2 py-1 border border-gray-300 rounded-lg text-sm flex-1 outline-none" autoFocus />
                                                    <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description..."
                                                        className="px-2 py-1 border border-gray-300 rounded-lg text-sm flex-1 outline-none" />
                                                    <input type="number" value={editStart} onChange={e => setEditStart(e.target.value ? parseInt(e.target.value) : '')}
                                                        className="px-2 py-1 border border-gray-300 rounded-lg text-sm w-16 outline-none" placeholder="Start" />
                                                    <input type="number" value={editEnd} onChange={e => setEditEnd(e.target.value ? parseInt(e.target.value) : '')}
                                                        className="px-2 py-1 border border-gray-300 rounded-lg text-sm w-16 outline-none" placeholder="End" />
                                                    <button onClick={() => handleUpdate(topic.id)} className="p-1 text-green-600 hover:text-green-800">
                                                        <FiCheck className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:text-gray-600">
                                                        <FiX className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{topic.topic_name}</p>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                                        {topic.source} &middot; pages {topic.start_page}–{topic.end_page}
                                                        {topic.topic_description && ` — ${topic.topic_description}`}
                                                    </p>
                                                </div>
                                            )}
                                        </button>

                                        {topic.namespace && (
                                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full shrink-0">{topic.namespace}</span>
                                        )}
                                        <button
                                            onClick={() => { setEditingId(topic.id); setEditName(topic.topic_name); setEditDesc(topic.topic_description || ''); setEditStart(topic.start_page); setEditEnd(topic.end_page) }}
                                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors shrink-0" title="Edit">
                                            <FiEdit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(topic.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0" title="Delete">
                                            <FiTrash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Expanded chunks */}
                                    {expandedTopicId === topic.id && (
                                        <div className="border-t border-gray-100 bg-gray-50/50">
                                            {loadingChunks === topic.id ? (
                                                <div className="flex items-center justify-center py-6">
                                                    <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                                </div>
                                            ) : (topicChunks[topic.id] || []).length === 0 ? (
                                                <p className="text-sm text-gray-400 py-6 text-center">No chunks found for this page range.</p>
                                            ) : (
                                                <div className="divide-y divide-gray-100">
                                                    {(topicChunks[topic.id] || []).map(chunk => (
                                                        <div key={chunk.id} className="px-4 py-3">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-mono text-gray-400">#{chunk.id}</span>
                                                                <span className="text-xs text-gray-500">p{chunk.page}</span>
                                                                {chunk.section && <span className="text-xs text-gray-400 truncate max-w-[250px]">{chunk.section}</span>}
                                                            </div>
                                                            <p className="text-xs text-gray-600 leading-relaxed">{chunk.content_preview}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
