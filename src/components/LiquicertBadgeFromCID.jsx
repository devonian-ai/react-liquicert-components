import React, { Component } from 'react';
import LiquicertBadgeFromData from './LiquicertBadgeFromData'

let apiPath = "https://liquicert.io";

class LiquicertBadgeFromCID extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            pathCID: this.props.pathCID, //pathCID
            communityData: [], //communityData
            pathRecord: null,
            pathjson: null, //pathInfo
            datacid: '',
            contentInfo: [{name:'Loading data...', payload_cid: ''}] //assetName={this.state.contentInfo.name}
        };

        this.loadCommunityData = this.loadCommunityData.bind(this);
        this.loadPathData = this.loadPathData.bind(this);
    }

    componentDidMount() {
        this.loadCommunityData();
        this.loadPathData();
    }

    loadCommunityData(){
        fetch(apiPath+"/communityDetails")
            .then((res) => res.json())
            .then((data) => {
              this.setState({
                communityData: data
              })
            });
      }

    loadPathData(){
        const trustPathCID = this.state.pathCID; // Add this line
        fetch(apiPath+"/getTrustPathByCID?path_CID=".concat(trustPathCID))
        .then((res) => res.json())
        .then((data) => {
            const pathjson = JSON.parse(data[0].pathstr);
            this.setState({
                pathRecord: data[0],
                pathjson,
                datacid: pathjson.attestation.payload_cid
            })

            fetch(apiPath+"/getAttestationByID?payload_CID=".concat(pathjson.attestation.payload_cid))
            .then((res) => res.json())
            .then((data) => {
            this.setState({
                contentInfo: data[0],
                expandedRecord: new Array(data.length).fill(0),
                title: data[0].name
                })
            });
        });
    }

    render() {

        return (
            <div>
                {/* <p>LC Badge Componnentt</p>
                <p>{this.state.pathCID}</p>
                <p>{this.state.datacid}</p>
                <p>{JSON.stringify(this.state.pathjson)}</p> */}
                <LiquicertBadgeFromData pathInfo={this.state.pathjson} assetName={this.state.contentInfo.name} communityData={this.state.communityData} pathCID={this.state.pathCID} />
            </div>
        );
    }
}

export default LiquicertBadgeFromCID;