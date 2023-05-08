export enum EnumComponentType {
    page = 'FdPage',
    layout = 'FdLayout',
    form = 'FdForm',
    card = 'FdCard',
    button = 'FdButton',
    input = 'FdInput',
    textField = 'FdTextfield',
    number = 'FdNumber',
    integer = 'FdInteger',
    float = 'FdFloat',
    switch = 'FdSwitch',
    sliders = 'FdSliders',
    radios = 'FdRadios',
    datePicker = 'FdDatePicker',
    textarea = 'FdTextarea',
    rate = 'FdRate',
    divider = 'FdDivider',
    select = 'FdSelect',
    demo1 = 'FdDemo1',
    chatGPT = 'FdChatGPT',
}

export enum EnumComponentGroup {
    page = '-1',
    layout = '0',
    base = '1',
    form = '2',
    custom = '3',
    lib = '4',
}

export enum EnumApiType {
    normal = '1', //普通api
    data = '2', //数据api，一个api列表里只有一个数据api，用于提供组件的动态数据源
}

export enum EnumEventName {
    click = 'click',
    mouseOver = 'mouseover',
    mouseLeave = 'mouseleave',
    focus = 'focus',
    change = 'change',
    blur = 'blur',
    hoverChange = 'hoverChange',
}

export enum EnumEventType {
    script = 'script',
    pageFunction = 'pf',
    appFunction = 'af',
}

export enum EnumPropsValueType {
    string = 'string',
    number = 'number',
    boolean = 'boolean',
    array = 'array',
    object = 'object',
    expression = 'expression', // 变量，表达式
    function = 'function',
}
