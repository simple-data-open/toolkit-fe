declare global {
  // 声明 JSX 的命名空间
  namespace JSX {
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
      svg: SVGSVGElement;
      circle: SVGCircleElement;
      rect: SVGRectElement;
      line: SVGLineElement;
      ellipse: SVGEllipseElement;
      path: SVGPathElement;
      polygon: SVGPolygonElement;
      polyline: SVGPolylineElement;
      text: SVGTextElement;
      tspan: SVGTSpanElement;
      textPath: SVGTextPathElement;
      image: SVGImageElement;
      foreignObject: SVGForeignObjectElement;
      g: SVGGElement;
      defs: SVGDefsElement;
      symbol: SVGSymbolElement;
      use: SVGUseElement;
      marker: SVGMarkerElement;
      pattern: SVGPatternElement;
      clipPath: SVGClipPathElement;
      mask: SVGMaskElement;
      linearGradient: SVGLinearGradientElement;
      radialGradient: SVGRadialGradientElement;
      stop: SVGStopElement;
      filter: SVGFilterElement;
      feBlend: SVGFEBlendElement;
      feColorMatrix: SVGFEColorMatrixElement;
      feComponentTransfer: SVGFEComponentTransferElement;
      feComposite: SVGFECompositeElement;
      feConvolveMatrix: SVGFEConvolveMatrixElement;
      feDiffuseLighting: SVGFEDiffuseLightingElement;
      feDisplacementMap: SVGFEDisplacementMapElement;
      feDistantLight: SVGFEDistantLightElement;
      feDropShadow: SVGFEDropShadowElement;
      feFlood: SVGFEFloodElement;
      feFuncA: SVGFEFuncAElement;
      feFuncB: SVGFEFuncBElement;
      feFuncG: SVGFEFuncGElement;
      feFuncR: SVGFEFuncRElement;
      feGaussianBlur: SVGFEGaussianBlurElement;
      feImage: SVGFEImageElement;
      feMerge: SVGFEMergeElement;
      feMergeNode: SVGFEMergeNodeElement;
      feMorphology: SVGFEMorphologyElement;
      feOffset: SVGFEOffsetElement;
      fePointLight: SVGFEPointLightElement;
      feSpecularLighting: SVGFESpecularLightingElement;
      feSpotLight: SVGFESpotLightElement;
      feTile: SVGFETileElement;
      feTurbulence: SVGFETurbulenceElement;
      animate: SVGAnimateElement;
      animateMotion: SVGAnimateMotionElement;
      animateTransform: SVGAnimateTransformElement;
      set: SVGSetElement;
      view: SVGViewElement;
      metadata: SVGMetadataElement;
    }

    interface DomElement extends IntrinsicHTMLElements, IntrinsicSVGElements {
      //  web component 扩展
      [key: string]: any;
    }

    interface IntrinsicElements extends DomElement {
      [key: string]: DomElement[keyof DomElement] & {
        children?: Child;
      };
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
    type Element = IntrinsicElement<keyof IntrinsicElements>;

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
  }
}

export {};
