// 声明 JSX 的命名空间
export namespace JSX {
  type MinPartial<T> = Partial<Omit<T, 'children'>> &
    ElementChildrenAttribute & {
      class?: string;
    };
  // HTML 的属性支持（继承 TypeScript 内置的类型）
  interface IntrinsicHTMLElements {
    a: MinPartial<HTMLAnchorElement>;
    abbr: MinPartial<HTMLElement>;
    address: MinPartial<HTMLElement>;
    area: MinPartial<HTMLAreaElement>;
    article: MinPartial<HTMLElement>;
    aside: MinPartial<HTMLElement>;
    audio: MinPartial<HTMLAudioElement>;
    b: MinPartial<HTMLElement>;
    base: MinPartial<HTMLBaseElement>;
    bdi: MinPartial<HTMLElement>;
    bdo: MinPartial<HTMLElement>;
    blockquote: MinPartial<HTMLQuoteElement>;
    body: MinPartial<HTMLBodyElement>;
    br: MinPartial<HTMLBRElement>;
    button: MinPartial<HTMLButtonElement>;
    canvas: MinPartial<HTMLCanvasElement>;
    caption: MinPartial<HTMLElement>;
    cite: MinPartial<HTMLElement>;
    code: MinPartial<HTMLElement>;
    col: MinPartial<HTMLTableColElement>;
    colgroup: MinPartial<HTMLTableColElement>;
    data: MinPartial<HTMLDataElement>;
    datalist: MinPartial<HTMLDataListElement>;
    dd: MinPartial<HTMLElement>;
    del: MinPartial<HTMLModElement>;
    details: MinPartial<HTMLDetailsElement>;
    dfn: MinPartial<HTMLElement>;
    dialog: MinPartial<HTMLDialogElement>;
    div: MinPartial<HTMLDivElement>;
    dl: MinPartial<HTMLDListElement>;
    dt: MinPartial<HTMLElement>;
    em: MinPartial<HTMLElement>;
    embed: MinPartial<HTMLEmbedElement>;
    fieldset: MinPartial<HTMLFieldSetElement>;
    figcaption: MinPartial<HTMLElement>;
    figure: MinPartial<HTMLElement>;
    footer: MinPartial<HTMLElement>;
    form: MinPartial<HTMLFormElement>;
    h1: MinPartial<HTMLHeadingElement>;
    h2: MinPartial<HTMLHeadingElement>;
    h3: MinPartial<HTMLHeadingElement>;
    h4: MinPartial<HTMLHeadingElement>;
    h5: MinPartial<HTMLHeadingElement>;
    h6: MinPartial<HTMLHeadingElement>;
    head: MinPartial<HTMLHeadElement>;
    header: MinPartial<HTMLElement>;
    hgroup: MinPartial<HTMLElement>;
    hr: MinPartial<HTMLHRElement>;
    html: MinPartial<HTMLHtmlElement>;
    i: MinPartial<HTMLElement>;
    iframe: MinPartial<HTMLIFrameElement>;
    img: MinPartial<HTMLImageElement>;
    input: MinPartial<HTMLInputElement>;
    ins: MinPartial<HTMLModElement>;
    kbd: MinPartial<HTMLElement>;
    label: MinPartial<HTMLLabelElement>;
    legend: MinPartial<HTMLLegendElement>;
    li: MinPartial<HTMLLIElement>;
    link: MinPartial<HTMLLinkElement>;
    main: MinPartial<HTMLElement>;
    map: MinPartial<HTMLMapElement>;
    mark: MinPartial<HTMLElement>;
    menu: MinPartial<HTMLMenuElement>;
    meta: MinPartial<HTMLMetaElement>;
    meter: MinPartial<HTMLMeterElement>;
    nav: MinPartial<HTMLElement>;
    noscript: MinPartial<HTMLElement>;
    object: MinPartial<HTMLObjectElement>;
    ol: MinPartial<HTMLOListElement>;
    optgroup: MinPartial<HTMLOptGroupElement>;
    option: MinPartial<HTMLOptionElement>;
    output: MinPartial<HTMLOutputElement>;
    p: MinPartial<HTMLParagraphElement>;
    param: MinPartial<HTMLElement>;
    picture: MinPartial<HTMLPictureElement>;
    pre: MinPartial<HTMLPreElement>;
    progress: MinPartial<HTMLProgressElement>;
    q: MinPartial<HTMLQuoteElement>;
    rp: MinPartial<HTMLElement>;
    rt: MinPartial<HTMLElement>;
    ruby: MinPartial<HTMLElement>;
    s: MinPartial<HTMLElement>;
    samp: MinPartial<HTMLElement>;
    script: MinPartial<HTMLScriptElement>;
    section: MinPartial<HTMLElement>;
    select: MinPartial<HTMLSelectElement>;
    slot: MinPartial<HTMLSlotElement>;
    small: MinPartial<HTMLElement>;
    source: MinPartial<HTMLSourceElement>;
    span: MinPartial<HTMLSpanElement>;
    strong: MinPartial<HTMLElement>;
    style: MinPartial<HTMLStyleElement>;
    sub: MinPartial<HTMLElement>;
    summary: MinPartial<HTMLElement>;
    sup: MinPartial<HTMLElement>;
    table: MinPartial<HTMLTableElement>;
    tbody: MinPartial<HTMLTableSectionElement>;
    td: MinPartial<HTMLTableCellElement>;
    template: MinPartial<HTMLTemplateElement>;
    textarea: MinPartial<HTMLTextAreaElement>;
    tfoot: MinPartial<HTMLTableSectionElement>;
    th: MinPartial<HTMLTableCellElement>;
    thead: MinPartial<HTMLTableSectionElement>;
    time: MinPartial<HTMLTimeElement>;
    title: MinPartial<HTMLTitleElement>;
    tr: MinPartial<HTMLTableRowElement>;
    track: MinPartial<HTMLTrackElement>;
    u: MinPartial<HTMLElement>;
    ul: MinPartial<HTMLUListElement>;
    var: MinPartial<HTMLElement>;
    video: MinPartial<HTMLVideoElement>;
    wbr: MinPartial<HTMLElement>;
    // svg
  }
  // svg 标签
  interface IntrinsicSVGElements {
    svg: MinPartial<SVGSVGElement>;
    circle: MinPartial<SVGCircleElement>;
    rect: MinPartial<SVGRectElement>;
    line: MinPartial<SVGLineElement>;
    ellipse: MinPartial<SVGEllipseElement>;
    path: MinPartial<SVGPathElement>;
    polygon: MinPartial<SVGPolygonElement>;
    polyline: MinPartial<SVGPolylineElement>;
    text: MinPartial<SVGTextElement>;
    tspan: MinPartial<SVGTSpanElement>;
    textPath: MinPartial<SVGTextPathElement>;
    image: MinPartial<SVGImageElement>;
    foreignObject: MinPartial<SVGForeignObjectElement>;
    g: MinPartial<SVGGElement>;
    defs: MinPartial<SVGDefsElement>;
    symbol: MinPartial<SVGSymbolElement>;
    use: MinPartial<SVGUseElement>;
    marker: MinPartial<SVGMarkerElement>;
    pattern: MinPartial<SVGPatternElement>;
    clipPath: MinPartial<SVGClipPathElement>;
    mask: MinPartial<SVGMaskElement>;
    linearGradient: MinPartial<SVGLinearGradientElement>;
    radialGradient: MinPartial<SVGRadialGradientElement>;
    stop: MinPartial<SVGStopElement>;
    filter: MinPartial<SVGFilterElement>;
    feBlend: MinPartial<SVGFEBlendElement>;
    feColorMatrix: MinPartial<SVGFEColorMatrixElement>;
    feComponentTransfer: MinPartial<SVGFEComponentTransferElement>;
    feComposite: MinPartial<SVGFECompositeElement>;
    feConvolveMatrix: MinPartial<SVGFEConvolveMatrixElement>;
    feDiffuseLighting: MinPartial<SVGFEDiffuseLightingElement>;
    feDisplacementMap: MinPartial<SVGFEDisplacementMapElement>;
    feDistantLight: MinPartial<SVGFEDistantLightElement>;
    feDropShadow: MinPartial<SVGFEDropShadowElement>;
    feFlood: MinPartial<SVGFEFloodElement>;
    feFuncA: MinPartial<SVGFEFuncAElement>;
    feFuncB: MinPartial<SVGFEFuncBElement>;
    feFuncG: MinPartial<SVGFEFuncGElement>;
    feFuncR: MinPartial<SVGFEFuncRElement>;
    feGaussianBlur: MinPartial<SVGFEGaussianBlurElement>;
    feImage: MinPartial<SVGFEImageElement>;
    feMerge: MinPartial<SVGFEMergeElement>;
    feMergeNode: MinPartial<SVGFEMergeNodeElement>;
    feMorphology: MinPartial<SVGFEMorphologyElement>;
    feOffset: MinPartial<SVGFEOffsetElement>;
    fePointLight: MinPartial<SVGFEPointLightElement>;
    feSpecularLighting: MinPartial<SVGFESpecularLightingElement>;
    feSpotLight: MinPartial<SVGFESpotLightElement>;
    feTile: MinPartial<SVGFETileElement>;
    feTurbulence: MinPartial<SVGFETurbulenceElement>;
    animate: MinPartial<SVGAnimateElement>;
    animateMotion: MinPartial<SVGAnimateMotionElement>;
    animateTransform: MinPartial<SVGAnimateTransformElement>;
    set: MinPartial<SVGSetElement>;
    view: MinPartial<SVGViewElement>;
    metadata: MinPartial<SVGMetadataElement>;
  }

  interface DomElement extends IntrinsicHTMLElements, IntrinsicSVGElements {
    //  web component 扩展
    [key: string]: any;
  }

  interface IntrinsicElements extends DomElement {
    [key: string]: DomElement[keyof DomElement];
  }

  interface IntrinsicElement<K extends keyof DomElement> {
    element: DomElement[K];
    attr<T extends keyof DomElement[K]>(
      attr: T,
      value?: DomElement[K][T],
    ): string | null | void;
    remove(): void;
    style(style: Partial<CSSStyleDeclaration>): void;
    __H__: symbol;
  }

  // 定义返回的 JSX 元素类型
  export type Element = IntrinsicElement<keyof IntrinsicElements>;

  // 子节点可以是以下类型
  type Child =
    | IntrinsicElement<keyof IntrinsicElements>
    | string
    | number
    | boolean
    | null
    | undefined;

  // 定义 Fragment 的 children 属性
  interface ElementChildrenAttribute {
    children?: Child | Child[]; // 定义 children 属性
  }

  export type HyperscriptFunc<K extends keyof IntrinsicElements> = (
    props: IntrinsicElements[K],
  ) => IntrinsicElement<K>;
}
