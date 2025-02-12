"use client"

import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

import { useGetProduct } from '../api/use-get-product'
import { useProductStore } from '../store/use-product'

// 定义类型
// RawProductItem 表示单个产品项的结构
type RawProductItem = {
  id: string
  sku: string
  qtyInStock: number
  price: number
  configurations: Array<{
    variation: { id: string; name: string } // 变体信息
    variationOption: { id: string; value: string } // 变体选项信息
  }>
}

// RawProduct 表示原始产品数据的结构
type RawProduct = {
  id: string
  name: string
  description: string
  category: { id: string; name: string }
  productItems: RawProductItem[]
}

// Variation 表示变体的结构
type Variation = {
  id: string
  name: string
  options: Array<{ id: string; value: string }> // 变体选项
}

// Configuration 表示配置的结构
type Configuration = {
  id: string
  sku: string
  price: number
  qtyInStock: number
  combination: Record<string, string> // 变体与选项的组合
}

// Product 表示最终产品数据的结构
type Product = {
  id: string
  name: string
  description: string
  category: {
    id: string
    name: string
  }
  variations: Variation[]
  configurations: Configuration[]
  availableOptions: Record<string, Record<string, string[]>>
}

// 数据转换函数，将原始产品数据转换为可用的产品数据
function transformProductData(rawProduct: RawProduct): Product {
  const variations: Variation[] = [] // 存储变体
  const configurationsMap: Record<string, Configuration> = {} // 存储配置
  const availableOptions: Record<string, Record<string, string[]>> = {} // 存储可用选项

  // 遍历原始产品项
  rawProduct.productItems.forEach(item => {
    const configuration: Configuration = {
      id: item.id,
      sku: item.sku,
      price: item.price,
      qtyInStock: item.qtyInStock,
      combination: {}
    }

    // 遍历每个配置
    item.configurations.forEach(conf => {
      const { variation, variationOption } = conf

      // 构建 variations
      let variationIndex = variations.findIndex(v => v.id === variation.id)
      if (variationIndex === -1) {
        variations.push({
          id: variation.id,
          name: variation.name,
          options: [] // 初始化选项
        })
        variationIndex = variations.length - 1
      }
      // 添加变体选项
      if (!variations[variationIndex].options.some(opt => opt.id === variationOption.id)) {
        variations[variationIndex].options.push({
          id: variationOption.id,
          value: variationOption.value
        })
      }

      // 构建 configuration combination
      configuration.combination[variation.id] = variationOption.id

      // 构建 availableOptions
      if (!availableOptions[variation.id]) {
        availableOptions[variation.id] = {}
      }
      if (!availableOptions[variation.id][variationOption.id]) {
        availableOptions[variation.id][variationOption.id] = []
      }
      // 更新可用选项
      Object.entries(configuration.combination).forEach(([varId, optId]) => {
        if (varId !== variation.id) {
          if (!availableOptions[varId]) availableOptions[varId] = {}
          if (!availableOptions[varId][optId]) availableOptions[varId][optId] = []
          if (!availableOptions[varId][optId].includes(variationOption.id)) {
            availableOptions[varId][optId].push(variationOption.id)
          }
          if (!availableOptions[variation.id][variationOption.id].includes(optId)) {
            availableOptions[variation.id][variationOption.id].push(optId)
          }
        }
      })
    })

    configurationsMap[item.id] = configuration
  })

  // 返回转换后的产品数据
  return {
    ...rawProduct,
    variations,
    configurations: Object.values(configurationsMap),
    availableOptions
  }
}

// Product 组件，接收产品 ID 作为属性
function Product({ productId }: { productId: string }) {
  const { data: rawProduct } = useGetProduct(productId) as { data: RawProduct }
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({}) // 存储选中的选项

  // 使用 useMemo 来优化性能
  const product = useMemo(() => {
    if (!rawProduct) return null
    return transformProductData(rawProduct)
  }, [rawProduct])

  // 处理选项选择
  const handleOptionSelect = (variationId: string, optionId: string) => {
    if(selectedOptions[variationId] === optionId) {
      setSelectedOptions(prev => {
        const newSelectedOptions = { ...prev }
        delete newSelectedOptions[variationId] // 取消选择
        return newSelectedOptions
      })
    } else {
      setSelectedOptions(prev => ({
        ...prev,
        [variationId]: optionId // 选择新选项
      }))
    }
  }

  // 检查选项是否可用
  const isOptionAvailable = (variationId: string, optionId: string) => {
    if (!product || Object.keys(selectedOptions).length === 0) return true
    return Object.entries(selectedOptions).every(([selectedVarId, selectedOptId]) => {
      if (selectedVarId === variationId) return true
      return product.availableOptions[selectedVarId][selectedOptId].includes(optionId)
    })
  }

  // 获取当前配置
  const currentConfiguration = useMemo(() => {
    if (!product || Object.keys(selectedOptions).length !== product.variations.length) return null
    return product.configurations.find(config => 
      Object.entries(config.combination).every(([varId, optId]) => 
        selectedOptions[varId] === optId
      )
    )
  }, [selectedOptions, product])

  if (!product) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-sm text-gray-500 mb-4">Category: {product.category.name}</p>

      {product.variations.map(variation => (
        <div key={variation.id} className="mb-4">
          <h2 className="text-lg font-semibold mb-2">{variation.name}</h2>
          <div className="flex flex-wrap gap-2">
            {variation.options.map(option => (
              <button
                key={option.id}
                className={cn(
                  "px-3 py-1 border rounded",
                  selectedOptions[variation.id] === option.id
                    ? "bg-blue-500 text-white" // 选中状态
                    : isOptionAvailable(variation.id, option.id)
                    ? "bg-white hover:bg-gray-100" // 可用状态
                    : "bg-gray-200 text-gray-400 cursor-not-allowed" // 不可用状态
                )}
                onClick={() => handleOptionSelect(variation.id, option.id)}
                disabled={!isOptionAvailable(variation.id, option.id)} // 禁用不可用选项
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>
      ))}

      {currentConfiguration && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Selected Configuration</h2>
          <p>SKU: {currentConfiguration.sku}</p>
          <p>Price: ${currentConfiguration.price}</p>
          <p>In Stock: {currentConfiguration.qtyInStock}</p>
        </div>
      )}

      {!currentConfiguration && Object.keys(selectedOptions).length > 0 && (
        <p className="mt-4 text-red-500">Please select all variations to see the final configuration.</p>
      )}

      {/* Debug Information */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">Debug Info:</h3>
        <pre className="text-xs mt-2 overflow-auto">
          {JSON.stringify({ selectedOptions, currentConfiguration }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default function ProductDetails() {
  const { productId } = useProductStore()

  return (
    <div className="border p-2 rounded-md">
      {productId ? (
        <Product productId={productId} />
      ) : (
        <div>
          <h1>No product selected</h1>
        </div>
      )}
    </div>
  )
}
