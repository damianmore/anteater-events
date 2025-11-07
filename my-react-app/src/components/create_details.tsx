import React, { useState } from 'react'
import "./create_details.css"

export type CreateFormData = {
  title: string
  description: string
  day: string
  start_time: string
  end_time: string
  categories: string[]
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateFormData) => void
}

export default function CreateDetails({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [day, setDay] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [categories, setCategories] = useState('')
  const [categoryError, setCategoryError] = useState<string | null>(null)

  // Validate the catgories input (no special characters allowed)
  function validateCategories(raw: string) {
    if (!raw) return { valid: true, list: [] as string[] }
    const list = raw.split(',').map(s => s.trim()).filter(Boolean)
    if (list.length === 0) return { valid: true, list: [] as string[] }
    const forbidden: string[] = []
    const ok: string[] = []
    // allow letters, numbers, spaces, hyphens and underscores only
    const allowedRe = /^[A-Za-z0-9 _-]+$/
    for (const c of list) {
      if (!allowedRe.test(c)) forbidden.push(c)
      else ok.push(c.toLowerCase())
    }
    if (forbidden.length) return { valid: false, message: `Invalid categories (contains symbols): ${forbidden.join(', ')}`, list: ok }
    return { valid: true, list: ok }
  }

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // validate categories before submitting
    const v = validateCategories(categories)
    if (!v.valid) {
      setCategoryError((v as any).message || 'Invalid categories')
      return
    }

    onSubmit({
      title,
      description,
      day,
      start_time: startTime,
      end_time: endTime,
      categories: v.list,
    })
    
    // Clear fields after submissions
    setTitle('')
    setDescription('')
    setDay('')
    setStartTime('')
    setEndTime('')
    setCategories('')
    onClose()
  }

  function handleCloseAndReset() {
    // Clear form fields when the modal is closed
    setTitle('')
    setDescription('')
    setDay('')
    setStartTime('')
    setEndTime('')
    setCategories('')
    setCategoryError(null)
    onClose()
  }

  return (
    <div className='create-modal-root'>
  <div className="create-modal-backdrop" onClick={handleCloseAndReset} />
      <div className="create-modal">
        <form onSubmit={handleSubmit} className='form'>
          <div className="title">Create Event For Selected Location</div>
            <div className="input-container ic1">
            <input
              id="title"
              className="input"
              type="text"
              placeholder=" "
              title="Title"
              aria-label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="cut"></div>
            <label htmlFor="title" className="placeholder">Title</label>
            </div>
          <div className="input-container ic1">
            <input id="description" className="input" type="text" placeholder=" " title="Description" aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="cut"></div>
            <label htmlFor="description" className="placeholder">Description</label>
          </div>
          <div className="input-container ic1">
            <input id="day" className="input" type="date" placeholder="" title="Day" aria-label="Day" value={day} onChange={(e) => setDay(e.target.value)} />
            <div className="cut"></div>
            <label htmlFor="day" className="placeholder">Day</label>
          </div>
          <div className="input-container ic1">
            <input id="start-time" className="input" type="time" placeholder=" " title="Start time" aria-label="Start time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <div className="cut"></div>
            <label htmlFor="start-time" className="placeholder">Start Time</label>
          </div>
          <div className="input-container ic1">
            <input id="end-time" className="input" type="time" placeholder=" " title="End time" aria-label="End time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            <div className="cut"></div>
            <label htmlFor="end-time" className="placeholder">End Time</label>
          </div>
          <div className="input-container ic1">
            <input
              id="categories"
              className="input"
              type="text"
              placeholder=" "
              title="Categories"
              aria-label="Categories"
              value={categories}
              onChange={(e) => {
                setCategories(e.target.value)
                // live-validate lightly
                const v = validateCategories(e.target.value)
                setCategoryError(v.valid ? null : (v as any).message)
              }}
            />
            <div className="cut"></div>
            <label htmlFor="categories" className="placeholder">Categories (comma-separated)</label>
          </div>
          {categoryError ? <div className="input-error" role="alert">{categoryError}</div> : (
            <div className="input-help">Allowed: letters, numbers, spaces, hyphens and underscores. Max 10 categories.</div>
          )}
          <button type="submit" className="submit" disabled={!!categoryError || !title || !day || !startTime || !endTime}>Save</button>
        </form>
      </div>
    </div>
  )
}
