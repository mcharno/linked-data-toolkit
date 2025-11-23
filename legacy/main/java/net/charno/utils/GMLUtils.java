package net.charno.utils;

import java.util.List;
import java.util.Map;
import net.charno.gml.Attributes;
import net.charno.gml.Box;
import net.charno.gml.GML;
import net.charno.gml.GeometryPoints;
import net.charno.gml.enums.GeometryType;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 * @author mcharno <michael@charno.net>
 */
public class GMLUtils {

    /**
     * A method to turn an XML representation of GML into a GML Java object.
     * 
     * @param filePath The path where the XML document lives.
     * @param contextHeader A context header.
     * @param attributeList A list of attributes that we want to get.
     * @return A GML Java object to manipulate.
     */
    public static GML objectifyGML(String filePath, String contextHeader, List<String> attributeList) {
        GML gml = new GML();

        Document doc = XMLUtils.xmlToDoc(filePath);
        doc.getDocumentElement().normalize();
        NodeList featureCollectionList = doc.getElementsByTagName("ogr:FeatureCollection");

        for (int i = 0; i < featureCollectionList.getLength(); i++) {
            Node featureCollectionNode = featureCollectionList.item(i);

            if (featureCollectionNode.getNodeType() == 1) {
                Element featureCollection = (Element) featureCollectionNode;

                NodeList boundedByList = featureCollection.getElementsByTagName("gml:boundedBy");
                NodeList featureMemberList = featureCollection.getElementsByTagName("gml:featureMember");

                for (int bb1 = 0; bb1 < boundedByList.getLength(); bb1++) {
                    Element boundedBy = (Element) boundedByList.item(bb1);

                    NodeList boxList = boundedBy.getElementsByTagName("gml:Box");
                    for (int bb2 = 0; bb2 < boxList.getLength(); bb2++) {
                        Element box = (Element) boxList.item(bb2);

                        GeometryPoints[] bbox = new GeometryPoints[2];
                        NodeList coordList = box.getElementsByTagName("gml:coord");
                        for (int bb3 = 0; bb3 < coordList.getLength(); bb3++) {
                            Element coord = (Element) coordList.item(bb3);

                            String x = XMLUtils.getSingleValue(coord, "gml:X");

                            String y = XMLUtils.getSingleValue(coord, "gml:Y");

                            bbox[bb3] = new GeometryPoints(Double.parseDouble(x), Double.parseDouble(y));
                        }

                        gml.setGmlBox(new Box(bbox[0], bbox[1]));
                    }

                }

                for (int fm1 = 0; fm1 < featureMemberList.getLength(); fm1++) {
                    Attributes attrs = new Attributes();

                    Element featureMember = (Element) featureMemberList.item(fm1);

                    String tagName = featureMember.getChildNodes().item(1).getNodeName();
                    NodeList gmlFeatureList = featureMember.getElementsByTagName(tagName);
                    Element gmlFeature;
                    for (int fm2 = 0; fm2 < gmlFeatureList.getLength(); fm2++) {
                        gmlFeature = (Element) gmlFeatureList.item(fm2);
                        Map<String, String> bdAttributes = XMLUtils.getAttributes(gmlFeature);
                        for (String s : bdAttributes.keySet()) {
                            if ("fid".equals(s)) {
                                attrs.setFid((String) bdAttributes.get(s));
                            }
                        }

                        NodeList geometryPropertyList = gmlFeature.getElementsByTagName("ogr:geometryProperty");
                        for (int fm3 = 0; fm3 < geometryPropertyList.getLength(); fm3++) {
                            Element geometryProperty = (Element) geometryPropertyList.item(fm3);

                            NodeList geometryList;
                            NodeList lineStringList = geometryProperty.getElementsByTagName("gml:LineString");
                            NodeList polygonList = geometryProperty.getElementsByTagName("gml:Polygon");

                            if (lineStringList.getLength() > 0) {
                                attrs.getGeometry().setGeometryType(GeometryType.LINESTRING);
                                geometryList = lineStringList;
                            } else if (polygonList.getLength() > 0) {
                                attrs.getGeometry().setGeometryType(GeometryType.POLYGON);
                                geometryList = polygonList.item(0).getChildNodes().item(0).getChildNodes();
                            } else {
                                attrs.getGeometry().setGeometryType(GeometryType.POINT);
                                geometryList = geometryProperty.getElementsByTagName("gml:Points");
                            }

                            for (int fm4 = 0; fm4 < geometryList.getLength(); fm4++) {
                                Element geometryString = (Element) geometryList.item(fm4);

                                String _coordinates = XMLUtils.getSingleValue(geometryString, "gml:coordinates").replace(",", "|");
                                _coordinates = _coordinates.replace(" ", ",");
                                _coordinates = _coordinates.replace("|", " ");

                                attrs.getGeometry().getWktPoints().append(_coordinates);
                                attrs.getGeometry().getWktPoints().append("))");
                            }
                        }

                        attrs.setContextID(XMLUtils.getSingleValue(gmlFeature, "ogr:" + contextHeader));

                        for (String attributeHeader : attributeList) {
                            attrs.getAttributeList().put(attributeHeader, XMLUtils.getSingleValue(gmlFeature, "ogr:" + attributeHeader));
                        }
                    }
                    gml.getGmlAttributes().add(attrs);
                }
            }
        }
        return gml;
    }
}
