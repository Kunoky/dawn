import { mount } from '@vue/test-utils'
import TestComponent from '@/view/demo/components/User.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/store/app'

describe('测试demo', () => {
  let store
  beforeAll(() => {
    /**单元测试环境下，需要显式的激活pinia */
    setActivePinia(createPinia())
    store = useAppStore()
  })

  it('mount component', async () => {
    expect(TestComponent).toBeTruthy()
    const id = 1
    await store.getUser(id)
    const wrapper = mount(TestComponent, {
      propsData: {
        id,
      },
    })
    expect(wrapper.text()).toContain('Leanne Graham')
    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.get('b').trigger('click')

    expect(wrapper.text()).toContain('1-770-736-8031 x56442')
  })
})
