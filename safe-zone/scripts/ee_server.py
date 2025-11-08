"""
Simple backend to produce an Earth Engine tile URL for the FIRMS layer.
Uses the existing auth.py (service account) in the repo to initialize EE.

Run:
  pip install earthengine-api flask flask-cors
  python scripts/ee_server.py

DO NOT commit your private key to source control.
"""
from flask import Flask, jsonify
from flask_cors import CORS
import ee
# import auth  # imports / initializes ee using your service account in auth.py

import ee
service_account = 'legislators@jonathondatabase.iam.gserviceaccount.com'
credentials = ee.ServiceAccountCredentials(service_account, 'private-key.json')
ee.Initialize(credentials)

app = Flask(__name__)
CORS(app)


def get_firms_tile_url(start='2018-08-01', end='2018-08-10'):
    aoi = ee.Geometry.Rectangle([-120.0, 37.5, -119.0, 38.5])
    # CLOUD_FILTER = 10  # Max percentage of cloud cover allowed (10%)

    print(f'start date: {start}')
    print(f'end date: {end}')
    dataset = ee.ImageCollection('FIRMS') \
            .filterDate(start, end) \
            .filterBounds(aoi)
    # Check if the collection is empty
    if dataset.size().getInfo() == 0:
          return None, "Image Collection is empty after filtering. Try adjusting dates or cloud filter."

    # Reduce the collection to a single image by taking the median.
        # This creates a 'cloud-free' composite.
    composite = dataset.median()
    fires_collection = dataset.select('T21') 
    composite_fire = fires_collection.median().rename('T21') # Resulting image will have a single band named 'T21'
    fires_vis = {
        'bands': ['T21'],
        'min': 325.0,
        'max': 400.0,
        'palette': ['red', 'orange', 'yellow'],
    }
    # Apply visualization to the composite
    vis_image = composite_fire.visualize(fires_vis).clip(aoi) # <-- Use composite_fire
    # --- 4. Get the Map ID and construct the Tile URL ---
    map_info = vis_image.getMapId()
    map_id = map_info['mapid']
    token = map_info['token']
    # {z}/{x}/{y} are standard Leaflet/Google Maps URL placeholders
    tile_url = f"https://earthengine.googleapis.com/v1alpha/tiles/{map_id}/{{z}}/{{x}}/{{y}}?token={token}"

    return tile_url, None

@app.route('/tile-url')
def tile_url():
    try:
        url = get_firms_tile_url()
        return jsonify({'tile_url': url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # listen on all interfaces so a device on the LAN can reach it
    app.run(host='0.0.0.0', port=8080, debug=False)