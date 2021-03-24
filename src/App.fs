module App

open Browser.Dom
open Fable.Core
open Fable.Core.JsInterop

type IRender =
    abstract renderApp : _ -> unit

[<ImportAll("./react/index.js")>]
let renderReact: IRender = jsNative

renderReact.renderApp()
