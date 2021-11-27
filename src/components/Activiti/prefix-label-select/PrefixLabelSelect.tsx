import { Select } from 'ant-design-vue';
import { defineComponent, PropType, computed } from 'vue';
import './prefix-label-select.css';

const PrefixLabelSelect = defineComponent({
  props: {
    ...Select.props,
    prefixTitle: {
      type: String as PropType<string>,
      default: () => '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const computedModelValue = computed({
      get: () => props.value,
      set: (val) => emit('update:modelValue', val),
    });

    return () => (
      <div class="prefix-label-select-container">
        {props.prefixTitle && <div class="prefix-title ">{props.prefixTitle}</div>}
        <Select
          class="prefix-label-select"
          v-model={computedModelValue.value}
          {...props}
          v-slots={slots}
        />
      </div>
    );
  },
});

export default PrefixLabelSelect;
