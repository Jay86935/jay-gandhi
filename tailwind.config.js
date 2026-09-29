module.exports = { 
    content: ['./index.html', './script.js'], 
    theme: { 
        extend: { 
            fontFamily: { 
                sans: ['Inter', 'sans-serif'], 
                mono: ['Space Grotesk', 'monospace'], 
            }, 
            colors: { 
                bg: 'var(--bg)', 
                surface: 'var(--surface)', 
                'surface-2': 'var(--surface-2)', 
                border: 'var(--border)', 
                'border-strong': 'var(--border-strong)',
                text: 'var(--text)', 
                'text-muted': 'var(--text-muted)', 
                'text-subtle': 'var(--text-subtle)',
                accent: 'var(--accent)', 
                'accent-hover': 'var(--accent-hover)', 
                'on-accent': 'var(--on-accent)',
                'accent-soft': 'var(--accent-soft)', 
                support: 'var(--support)', 
                danger: 'var(--danger)' 
            } 
        } 
    } 
}
