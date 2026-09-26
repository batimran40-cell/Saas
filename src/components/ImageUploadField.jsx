import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function ImageUploadField({ label, value, onChange, pathHint }) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)

    const ext = file.name.split('.').pop()
    const path = `${user.id}/${pathHint}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('shop-images').upload(path, file, {
      upsert: true,
    })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('shop-images').getPublicUrl(path)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="image-field">
      {label && <span className="image-field-label">{label}</span>}
      <div className="image-field-row">
        {value && <img src={value} alt="" className="image-field-preview" />}
        <div className="image-field-controls">
          <input
            type="text"
            placeholder="Image URL"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <label className="btn btn-outline image-field-upload">
            {uploading ? 'Uploading…' : 'Upload photo'}
            <input type="file" accept="image/*" onChange={handleFile} hidden />
          </label>
        </div>
      </div>
      {error && <p className="auth-error">{error}</p>}
    </div>
  )
}
