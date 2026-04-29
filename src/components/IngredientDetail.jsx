// Ingredient Detail Modal
// Reads: ingredient, detail, products, isInMeal
// Writes: onAddToMeal, onRemoveFromMeal, onSelectProduct, onClose
// Local state: selectedProductId, scanState, scannedProductId

import { useState } from 'react'

const CATEGORY_COLOR = {
  Protein:    '#4A90D9',
  Carbs:      '#F0A030',
  Vegetables: '#4E7C59',
  Fats:       '#D95C4A',
  Dairy:      '#8B5CF6',
}

function MacroGrid({ per100g }) {
  return (
    <div className="detail-macro-grid">
      <div className="detail-macro-cell">
        <div className="detail-macro-value">{per100g.calories}</div>
        <div className="detail-macro-label">kcal</div>
      </div>
      <div className="detail-macro-cell">
        <div className="detail-macro-value detail-macro-protein">{per100g.protein}g</div>
        <div className="detail-macro-label">Protein</div>
      </div>
      <div className="detail-macro-cell">
        <div className="detail-macro-value detail-macro-carbs">{per100g.carbs}g</div>
        <div className="detail-macro-label">Carbs</div>
      </div>
      <div className="detail-macro-cell">
        <div className="detail-macro-value detail-macro-fat">{per100g.fat}g</div>
        <div className="detail-macro-label">Fat</div>
      </div>
    </div>
  )
}

function IngredientDetail({
  ingredient,
  detail,
  products,
  isInMeal,
  selectedProductId,
  onAddToMeal,
  onRemoveFromMeal,
  onSelectProduct,
  onClose,
}) {
  const [scanState, setScanState]           = useState('idle')   // 'idle' | 'scanning' | 'scanned'
  const [scannedProductId, setScannedProductId] = useState(null)

  const categoryColor = CATEGORY_COLOR[ingredient.category] || '#888'

  // Active product — scanned takes priority over selected
  const activeProductId = scannedProductId || selectedProductId || (products[0]?.id ?? null)
  const activeProduct   = products.find((p) => p.id === activeProductId) || products[0]

  function handleScan() {
    if (scanState === 'scanning') return
    setScanState('scanning')
    setScannedProductId(null)

    setTimeout(() => {
      // Pick a random non-generic product
      const branded = products.filter((p) => p.brand !== 'Generic')
      const match   = branded[Math.floor(Math.random() * branded.length)]
      if (match) {
        setScannedProductId(match.id)
        onSelectProduct(match.id)
      }
      setScanState('scanned')
    }, 1000)
  }

  function handleProductClick(productId) {
    setScannedProductId(null)   // clear any scan result when manually selecting
    setScanState('idle')
    onSelectProduct(productId)
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card" role="dialog" aria-modal="true">

        {/* ── Header ── */}
        <div className="modal-header">
          <div>
            <div className="modal-ingredient-name">{ingredient.name}</div>
            <span
              className="modal-category-badge"
              style={{ background: categoryColor + '22', color: categoryColor }}
            >
              {ingredient.category}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="modal-body">

          {/* Description */}
          {detail?.description && (
            <p className="modal-description">{detail.description}</p>
          )}

          {/* Per-100g macro grid (base ingredient) */}
          <div className="modal-section-label">Per 100g (base)</div>
          <MacroGrid per100g={ingredient.per100g} />

          {/* Common uses */}
          {detail?.commonUses?.length > 0 && (
            <>
              <div className="modal-section-label">Common Uses</div>
              <div className="modal-tags">
                {detail.commonUses.map((use) => (
                  <span key={use} className="modal-tag">{use}</span>
                ))}
              </div>
            </>
          )}

          {/* Serving suggestions */}
          {detail?.servingSuggestions?.length > 0 && (
            <>
              <div className="modal-section-label">Serving Guide</div>
              <ul className="modal-serving-list">
                {detail.servingSuggestions.map((s) => (
                  <li key={s} className="modal-serving-item">{s}</li>
                ))}
              </ul>
            </>
          )}

          {/* ── Product Options ── */}
          <div className="modal-section-label">Product Options</div>
          <div className="modal-products">
            {products.map((product) => {
              const isActive = product.id === activeProductId
              const isScanned = product.id === scannedProductId
              return (
                <button
                  key={product.id}
                  className={`product-card ${isActive ? 'active' : ''}`}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="product-card-top">
                    <div className="product-brand">{product.brand}</div>
                    {isScanned && (
                      <span className="product-scanned-badge">Scanned</span>
                    )}
                    {isActive && !isScanned && (
                      <span className="product-selected-badge">Selected</span>
                    )}
                  </div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-serving">Serving: {product.servingSize}</div>
                  <div className="product-macros">
                    <span>{product.per100g.calories} kcal</span>
                    <span>P {product.per100g.protein}g</span>
                    <span>C {product.per100g.carbs}g</span>
                    <span>F {product.per100g.fat}g</span>
                  </div>
                  {product.barcode && (
                    <div className="product-barcode">#{product.barcode}</div>
                  )}
                </button>
              )
            })}
          </div>

          {/* ── Barcode Scanner ── */}
          <button
            className={`barcode-btn ${scanState === 'scanning' ? 'scanning' : ''}`}
            onClick={handleScan}
            disabled={scanState === 'scanning'}
          >
            {scanState === 'scanning' ? (
              <><div className="spinner" /> Scanning barcode…</>
            ) : scanState === 'scanned' ? (
              <>📷 Scan Again</>
            ) : (
              <>📷 Simulate Barcode Scan</>
            )}
          </button>

          {scanState === 'scanned' && scannedProductId && (
            <div className="scan-result">
              Matched: <strong>{products.find((p) => p.id === scannedProductId)?.brand} — {products.find((p) => p.id === scannedProductId)?.name}</strong>
            </div>
          )}

        </div>

        {/* ── Footer actions ── */}
        <div className="modal-footer">
          {isInMeal ? (
            <button className="modal-remove-btn" onClick={() => { onRemoveFromMeal(); onClose() }}>
              Remove from Meal
            </button>
          ) : (
            <button className="modal-add-btn" onClick={() => { onAddToMeal(); onClose() }}>
              Add to Meal
            </button>
          )}
          <button className="modal-cancel-btn" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  )
}

export default IngredientDetail
