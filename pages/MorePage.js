import React, { Component } from "react";
import { withRouter } from "next/router";
import Layout from "./layout";
import { LanguageHelper } from "../helpers/languageHelper";
import ReactMarkdown from "react-markdown";

class DocumentPage extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    loading: true,
    translation: {
      mainText:
        "# Heat Stress Scale - Documentation\n\n\nThis tool evaluates the risk for a 'typical individual'.\nConsequently, it cannot accurately estimate the exact risk encountered by every single individual.\nFor this reason, this application is intended for informational use only.\nIt is not intended to provide medical advice or replace professional medical judgment, diagnosis, or treatment.\n\n# Age Groups and population\n\n**Healthy adults** a person that falls into the 19 to 65 age category.\n\n **Healthy older adults** People aged 65 years who do not have any medical conditions.\n\n **Children** People aged younger than 19 years old.",
    },
  };

  componentDidMount() {
    this.loadTranslation();
  }

  async loadTranslation() {
    const { languageHelper } = this.props;

    let res = await languageHelper.translation("DocumentPage");

    this.setState({
      loading: false,
      translation: res,
    });
  }

  render() {
    return (
      <div>
        <Layout>
          <ReactMarkdown>{this.state.translation.mainText}</ReactMarkdown>
        </Layout>
      </div>
    );
  }
}

export default withRouter(LanguageHelper(DocumentPage));
