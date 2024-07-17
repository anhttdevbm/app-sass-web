import { CHECKABLE_LIST_ITEM, UNORDERED_LIST_ITEM } from "../../constants/draft.constants"
import { Map } from 'immutable'

const WRAPPER = <ul className='public-DraftStyleDefault-ul' />

const blockRenderMap = Map({
  [CHECKABLE_LIST_ITEM]: {
    element: 'li',
    wrapper: WRAPPER,
  },
})

const blockRenderMapForSameWrapperAsUnorderedListItem = blockRenderMap.merge(Map({
  [UNORDERED_LIST_ITEM]: {
    element: 'li',
    wrapper: WRAPPER,
  },
}))

export default blockRenderMap
export { WRAPPER, blockRenderMapForSameWrapperAsUnorderedListItem }